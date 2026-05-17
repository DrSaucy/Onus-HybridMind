import os
from dotenv import load_dotenv
import chromadb
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, StorageContext
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.embeddings.google_genai import GoogleGenAIEmbedding
from llama_index.core import Settings

load_dotenv()


# Initialize Gemini Embedding
Settings.embed_model = GoogleGenAIEmbedding(model="gemini-embedding-2", api_key=os.getenv("GOOGLE_API_KEY"))

# Setup ChromaDB
db = chromadb.PersistentClient(path="./chroma_db")
chroma_collection = db.get_or_create_collection("apex_contract")

# Setup vector store
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)

# Read documents and build index
documents = SimpleDirectoryReader(input_files=[os.path.abspath("data/apex_contract_2026.txt")]).load_data()
index = VectorStoreIndex.from_documents(documents, storage_context=storage_context)

print("ChromaDB setup complete!")
