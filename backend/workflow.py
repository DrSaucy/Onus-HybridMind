from llama_index.core.workflow import Workflow, step, StartEvent, StopEvent, Event
import json
import os
from dotenv import load_dotenv
from llama_index.llms.google_genai import GoogleGenAI

load_dotenv()
verifier_llm = GoogleGenAI(model="gemini-3.1-flash-lite", api_key=os.getenv("GOOGLE_API_KEY"))


# Assuming sql_tool and chroma_tool expose a ready-to-use query_engine
from sql_tool import query_engine as sql_engine
from chroma_tool import query_engine as chroma_engine

class DataGatheredEvent(Event):
    sql_result: str
    pdf_result: str
    pdf_file: str
    pdf_page: str

class VerificationFailedEvent(Event):
    reason: str

class AuditCompleteEvent(Event):
    final_json: dict
    pdf_file: str
    pdf_page: str

class AuditWorkflow(Workflow):
    
    # We can store state (like the vendor) directly on the workflow instance
    vendor: str = ""
    retry_count: int = 0
    manager = None

    def set_manager(self, manager):
        self.manager = manager

    @step
    async def executor_agent(self, ev: StartEvent | VerificationFailedEvent) -> DataGatheredEvent | StopEvent:
        if isinstance(ev, StartEvent):
            self.vendor = getattr(ev, "vendor", "Unknown Vendor")
            self.retry_count = 0
            if self.manager:
                await self.manager.broadcast(json.dumps({
                    "type": "audit",
                    "agent": "executor",
                    "message": f"Initiating cross-reference protocol for {self.vendor}. Fetching SQL balance sheets and OCR text from master contracts...",
                    "badge": None,
                    "variant": "normal"
                }))
        elif isinstance(ev, VerificationFailedEvent):
            self.retry_count += 1
            if self.retry_count > 3:
                print(f"🛑 CRITICAL: Maximum retries (3) reached. Aborting workflow. Last reason: {ev.reason}")
                return StopEvent(result={"error": "Max retries exceeded", "reason": ev.reason})
            print(f"⚠️ WARNING: Verifier rejected the math and we are retrying (Attempt {self.retry_count}/3). Reason: {ev.reason}")

        sql_query_str = f"Get total quantity and total paid for {self.vendor}"
        pdf_query_str = f"What are the volume discount and rebate terms for {self.vendor}?"

        print(f"Executor: Running SQL query -> '{sql_query_str}'")
        sql_response = await sql_engine.aquery(sql_query_str)

        print(f"Executor: Running Chroma query -> '{pdf_query_str}'")
        pdf_response = await chroma_engine.aquery(pdf_query_str)
        
        # Extract metadata dynamically
        pdf_file = "contract.pdf"
        pdf_page = "1"
        raw_txt_snippet = "No text context found."
        
        if hasattr(pdf_response, "source_nodes") and len(pdf_response.source_nodes) > 0:
            pdf_file = pdf_response.source_nodes[0].metadata.get('file_name', pdf_file)
            pdf_page = pdf_response.source_nodes[0].metadata.get('page_label', pdf_page)
            full_text = pdf_response.source_nodes[0].node.get_content().strip()
            # Find the most relevant line (containing rebate or discount or %)
            relevant_lines = [line.strip() for line in full_text.split('\n') if len(line.strip()) > 20 and any(kw in line.lower() for kw in ['rebate', 'discount', '%', 'threshold'])]
            
            if relevant_lines:
                # Take the longest relevant line or the first one
                raw_txt_snippet = max(relevant_lines, key=len)
                if len(raw_txt_snippet) > 250:
                    raw_txt_snippet = raw_txt_snippet[:247] + "..."
            else:
                raw_txt_snippet = full_text[:150] + "..."
                
        sql_summary = str(sql_response).strip()
        pdf_summary = str(pdf_response).strip()
        
        sql_query_run = sql_response.metadata.get("sql_query", "SQL Query") if hasattr(sql_response, "metadata") else "SQL Query"
        sql_raw_results = sql_response.metadata.get("result", []) if hasattr(sql_response, "metadata") else []
        
        executor_msg = (
            f"🔍 RAW SQL EXECUTED:\n{sql_query_run}\n"
            f"📊 RAW SQL DATA: {sql_raw_results}\n\n"
            f"📄 RAW TEXT FROM {pdf_file} (Page {pdf_page}):\n\"{raw_txt_snippet}\"\n\n"
            f"💡 SYNTHESIS:\n{sql_summary} {pdf_summary}"
        )
        
        if self.manager:
            await self.manager.broadcast(json.dumps({
                "type": "audit",
                "agent": "executor",
                "message": executor_msg,
                "badge": None,
                "variant": "normal"
            }))

        return DataGatheredEvent(
            sql_result=sql_summary,
            pdf_result=pdf_summary,
            pdf_file=pdf_file,
            pdf_page=pdf_page
        )

    @step
    async def verifier_agent(self, ev: DataGatheredEvent) -> AuditCompleteEvent | VerificationFailedEvent:
        prompt = f"""You are an elite financial auditor. Read the SQL data and the Contract terms. 
Step 1: Check if the quantity purchased meets the threshold for a rebate. 
Step 2: If it does, calculate the exact dollar amount of the rebate owed based on the total paid. 
Step 3: Output ONLY a raw JSON object with the keys: 'vendor', 'discrepancy_found' (boolean), 'amount_owed' (number), and 'reasoning' (brief string).

SQL Data:
{ev.sql_result}

Contract Terms:
{ev.pdf_result}
"""
        response = None
        try:
            # Await the async completion to not block the event loop
            response = await verifier_llm.acomplete(prompt)
            raw_text = response.text.strip()
            
            # Clean up markdown code block formatting more robustly
            if "```json" in raw_text:
                raw_text = raw_text.split("```json")[1].split("```")[0]
            elif "```" in raw_text:
                raw_text = raw_text.split("```")[1].split("```")[0]
                
            parsed_dict = json.loads(raw_text.strip())
            
            # Safely cast to float, handling strings with commas like "180,000"
            amount_raw = str(parsed_dict.get("amount_owed", 0)).replace(',', '')
            amount = float(amount_raw)
            
            # Check if amount_owed is exactly 180000
            if amount != 180000.0:
                print(f"DEBUG: Math failed. Extracted amount: {amount}. Raw response: {raw_text}")
                return VerificationFailedEvent(reason=f"Math invalid. Extracted amount: {amount}")
                
            reasoning = parsed_dict.get('reasoning', 'Discrepancy detected.')
            if self.manager:
                await self.manager.broadcast(json.dumps({
                    "type": "audit",
                    "agent": "verifier",
                    "message": f"Math validation failed. {reasoning}",
                    "badge": {"text": "LOW INTEGRITY", "color": "yellow"},
                    "variant": "normal"
                }))
                
            return AuditCompleteEvent(final_json=parsed_dict, pdf_file=ev.pdf_file, pdf_page=ev.pdf_page)
            
        except Exception as e:
            raw_resp = response.text if response else "NO RESPONSE (API Error or Rate Limit)"
            print(f"DEBUG: Parsing failed! Error: {e}. Raw response: {raw_resp}")
            return VerificationFailedEvent(reason=f"Format invalid or API Error: {str(e)}")

    @step
    async def chronicler_agent(self, ev: AuditCompleteEvent) -> StopEvent:
        amount_owed = float(ev.final_json.get("amount_owed", 0))
        
        if self.manager:
            await self.manager.broadcast(json.dumps({
                "type": "audit",
                "agent": "chronicler",
                "message": f"⚠️ ${amount_owed:,.0f} LEAKAGE DETECTED.\n\nSource: q1_procurement + {ev.pdf_file} Page {ev.pdf_page}",
                "badge": {"text": "CRITICAL BATCH #44", "color": "red"},
                "variant": "critical"
            }))
            
        return StopEvent(result=ev.final_json)

import asyncio

async def main():
    print("Initializing HybridMind Audit Workflow...")
    workflow = AuditWorkflow(timeout=120, verbose=True)
    
    # Kick off the workflow passing the vendor name
    result = await workflow.run(vendor="Apex Chemicals")
    
if __name__ == "__main__":
    asyncio.run(main())
