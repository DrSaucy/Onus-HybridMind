from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json

from workflow import AuditWorkflow

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
    vendor = "Apex Chemicals" if "apex" in request.message.lower() else "Unknown Vendor"
    
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
            amount_owed = float(result.get("amount_owed", 0))
            response_text = f"Audit complete for {vendor}. Detected a discrepancy. They owe us ${amount_owed:,.0f}."
            
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
