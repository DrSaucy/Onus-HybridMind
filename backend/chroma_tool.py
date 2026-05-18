import os
from dotenv import load_dotenv
import chromadb
from llama_index.core import VectorStoreIndex, Settings
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.llms.google_genai import GoogleGenAI
from llama_index.embeddings.google_genai import GoogleGenAIEmbedding

load_dotenv()

# Initialize Settings
Settings.llm = GoogleGenAI(model="gemini-3.1-flash-lite", api_key=os.getenv("GOOGLE_API_KEY"))
Settings.embed_model = GoogleGenAIEmbedding(model="gemini-embedding-2", api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize ChromaDB client and collection
db = chromadb.PersistentClient(path="./chroma_db")
chroma_collection = db.get_or_create_collection("apex_contract")

# Set up ChromaVectorStore and Index
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
index = VectorStoreIndex.from_vector_store(vector_store)

# Create the query engine (exposed for import)
query_engine = index.as_query_engine()

def main():
    query = "What are the exact terms of the volume discount and rebate for Industrial Adhesive in the Apex Chemicals contract?"
    print(f"Querying: {query}")
    response = query_engine.query(query)
    print("\nResponse:")
    print(response)

if __name__ == "__main__":
    main()
