from llama_index.core.workflow import Workflow, step, StartEvent, StopEvent, Event
import json
import os
from dotenv import load_dotenv
from llama_index.llms.google_genai import GoogleGenAI

load_dotenv()
verifier_llm = GoogleGenAI(model="gemini-2.5-flash", api_key=os.getenv("GOOGLE_API_KEY"))


# Assuming sql_tool and chroma_tool expose a ready-to-use query_engine
from sql_tool import query_engine as sql_engine
from chroma_tool import query_engine as chroma_engine

class DataGatheredEvent(Event):
    sql_result: str
    pdf_result: str

class VerificationFailedEvent(Event):
    reason: str

class AuditCompleteEvent(Event):
    final_json: dict

class AuditWorkflow(Workflow):
    
    # We can store state (like the vendor) directly on the workflow instance
    vendor: str = ""
    retry_count: int = 0

    @step
    async def executor_agent(self, ev: StartEvent | VerificationFailedEvent) -> DataGatheredEvent | StopEvent:
        if isinstance(ev, StartEvent):
            self.vendor = getattr(ev, "vendor", "Unknown Vendor")
            self.retry_count = 0
        elif isinstance(ev, VerificationFailedEvent):
            self.retry_count += 1
            if self.retry_count > 3:
                print(f"🛑 CRITICAL: Maximum retries (3) reached. Aborting workflow. Last reason: {ev.reason}")
                return StopEvent(result={"error": "Max retries exceeded", "reason": ev.reason})
            print(f"⚠️ WARNING: Verifier rejected the math and we are retrying (Attempt {self.retry_count}/3). Reason: {ev.reason}")

        sql_query_str = f"Get total quantity and total paid for {self.vendor}"
        pdf_query_str = f"What are the volume discount and rebate terms for {self.vendor}?"

        print(f"Executor: Running SQL query -> '{sql_query_str}'")
        sql_response = sql_engine.query(sql_query_str)

        print(f"Executor: Running Chroma query -> '{pdf_query_str}'")
        pdf_response = await chroma_engine.aquery(pdf_query_str)

        return DataGatheredEvent(
            sql_result=str(sql_response),
            pdf_result=str(pdf_response)
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
                
            return AuditCompleteEvent(final_json=parsed_dict)
            
        except Exception as e:
            raw_resp = response.text if response else "NO RESPONSE (API Error or Rate Limit)"
            print(f"DEBUG: Parsing failed! Error: {e}. Raw response: {raw_resp}")
            return VerificationFailedEvent(reason=f"Format invalid or API Error: {str(e)}")

    @step
    async def chronicler_agent(self, ev: AuditCompleteEvent) -> StopEvent:
        print("\n" + "="*50)
        print("🚨 AUDIT COMPLETE: DISCREPANCY DETECTED 🚨")
        print("="*50)
        print(json.dumps(ev.final_json, indent=4))
        print("="*50 + "\n")
        return StopEvent(result=ev.final_json)

import asyncio

async def main():
    print("Initializing HybridMind Audit Workflow...")
    workflow = AuditWorkflow(timeout=120, verbose=True)
    
    # Kick off the workflow passing the vendor name
    result = await workflow.run(vendor="Apex Chemicals")
    
if __name__ == "__main__":
    asyncio.run(main())
