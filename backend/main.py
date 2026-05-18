from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json

from workflow import AuditWorkflow, verifier_llm

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                pass

manager = ConnectionManager()

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    # Dynamically extract vendor name using LLM
    extract_prompt = f"Extract ONLY the company/vendor name from this text. Reply with ONLY the name, no punctuation, no other words: '{request.message}'"
    vendor_response = await verifier_llm.acomplete(extract_prompt)
    vendor = vendor_response.text.strip()
    
    if not vendor or len(vendor) > 50 or "unknown" in vendor.lower():
        vendor = "Unknown Vendor"
    
    workflow = AuditWorkflow(timeout=120, verbose=True)
    workflow.set_manager(manager)
    
    # Broadcast that user started a query
    await manager.broadcast(json.dumps({
        "type": "audit", 
        "agent": "executor",
        "message": f"[NEW REQUEST] User asked: {request.message}",
        "badge": None,
        "variant": "normal"
    }))
    
    try:
        result = await workflow.run(vendor=vendor)
        
        if "error" in result:
            response_text = f"Audit failed: {result['reason']}"
        else:
            vendor_res = result.get('vendor', vendor)
            qty = result.get('total_quantity', 0)
            expenditure = result.get('total_expenditure', 0)
            rebate = result.get('rebate_percentage', '0%')
            owed = result.get('amount_owed', 0)
            
            discrepancy = result.get('discrepancy_found', False)
            
            if discrepancy:
                situation = f"A discrepancy WAS DETECTED. The vendor failed to apply the volume rebate, resulting in a financial leakage of ${owed:,.2f}. State clearly that the vendor owes us this money."
            else:
                situation = "NO discrepancy was found. The vendor's procurement data is within contractual bounds. State clearly that the audit is clean and no money is owed."
            
            # Use the LLM to generate ONLY the dynamic paragraph
            prompt = f"""You are an elite procurement auditor. Write a brief, professional 1-paragraph conclusion based on these audit results.
{situation}
Do NOT introduce yourself. Do NOT output any lists or metrics — just ONE clear paragraph.

Audit JSON:
{json.dumps(result, indent=2)}
"""
            llm_response = await verifier_llm.acomplete(prompt)
            paragraph = llm_response.text.strip()
            
            # Manually construct the perfectly formatted string using double newlines
            response_text = f"""{paragraph}

**Audit Metrics:**

- **Vendor Name:** {vendor_res}

- **Total Quantity:** {qty:,}

- **Total Expenditure:** ${expenditure:,.2f}

- **Rebate Tier:** {rebate}

- **Amount Owed:** ${owed:,.2f}
"""
            
    except Exception as e:
        response_text = f"Audit encountered a critical error: {str(e)}"
    
    return {"response": response_text}

@app.websocket("/ws/audit")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # We just keep the connection open
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
