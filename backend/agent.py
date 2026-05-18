from llama_index.core.agent import ReActAgent
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.llms.google_genai import GoogleGenAI
from sql_tool import query_engine as sql_engine
from chroma_tool import query_engine as chroma_engine
import os
from dotenv import load_dotenv

load_dotenv()

sql_tool = QueryEngineTool(
    query_engine=sql_engine,
    metadata=ToolMetadata(
        name="sql_procurement_tool",
        description="Useful for translating natural language into SQL to query procurement data, vendor total spend, quantities, and item descriptions."
    )
)

chroma_tool = QueryEngineTool(
    query_engine=chroma_engine,
    metadata=ToolMetadata(
        name="contract_terms_tool",
        description="Useful for looking up contract rules, volume discounts, and rebate terms for vendors."
    )
)

import asyncio

class RateLimitedGemini(GoogleGenAI):
    async def astream_chat(self, *args, **kwargs):
        print("[RateLimiter] Waiting 4 seconds to secure the quota (15 RPM)...")
        await asyncio.sleep(4)
        return await super().astream_chat(*args, **kwargs)

    async def achat(self, *args, **kwargs):
        print("[RateLimiter] Waiting 4 seconds to secure the quota (15 RPM)...")
        await asyncio.sleep(4)
        return await super().achat(*args, **kwargs)

llm = RateLimitedGemini(model="gemini-3.1-flash-lite", api_key=os.getenv("GOOGLE_API_KEY"))

from llama_index.core import Settings

def create_agent(callback_manager=None):
    if callback_manager:
        llm.callback_manager = callback_manager
        Settings.callback_manager = callback_manager
    
    return ReActAgent(
        tools=[sql_tool, chroma_tool],
        llm=llm,
        verbose=True,
        max_iterations=4,
        system_prompt=(
            "You are a fast and efficient procurement auditor. "
            "Always try to gather all necessary data efficiently. "
            "If you have enough information to answer the user, stop immediately and give the final answer."
        )
    )
