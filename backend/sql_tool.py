import os
from sqlalchemy import create_engine
from llama_index.core import SQLDatabase, Settings
from llama_index.core.query_engine import NLSQLTableQueryEngine
from llama_index.llms.google_genai import GoogleGenAI
from llama_index.embeddings.google_genai import GoogleGenAIEmbedding
from dotenv import load_dotenv

load_dotenv()

Settings.llm = GoogleGenAI(model="gemini-3.1-flash-lite", api_key=os.getenv("GOOGLE_API_KEY"))
Settings.embed_model = GoogleGenAIEmbedding(model="models/embedding-001", api_key=os.getenv("GOOGLE_API_KEY"))

db_url = os.getenv("SUPABASE_DB_URL")
if db_url and db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

try:
    engine = create_engine(db_url)
    sql_database = SQLDatabase(engine, include_tables=["q1_procurement"])
    
    query_engine = NLSQLTableQueryEngine(sql_database=sql_database)
except Exception as e:
    print(f"Failed to initialize SQL Engine: {e}")
    # Fallback to mock for safety if DB is not reachable
    class MockSQLEngine:
        def query(self, query_str: str) -> str:
            return f"Mock SQL Result for: '{query_str}' -> Total quantity is 12000 and total paid is $1,200,000."
    query_engine = MockSQLEngine()
