# Onus HybridMind 🧠

A self-auditing intelligence agent bridging the gap between structured SQL and unstructured PDF contracts to detect procurement leakage. Designed as a high-performance **3-Agent Workflow** system utilizing LlamaIndex and Gemini Flash Lite.

## 🚀 Architecture Overview

HybridMind operates using an event-driven workflow consisting of three specialized AI agents working sequentially:

1. **Executor Agent (The Gatherer)**: Translates natural language into SQL queries against a live PostgreSQL database (Supabase) and cross-references results with unstructured PDF data using a Vector Database (ChromaDB).
2. **Verifier Agent (The Auditor)**: Acts as the logic and fusion layer. It performs mathematical validations and checks if the retrieved SQL purchase data complies with the discount thresholds extracted from the contracts.
3. **Chronicler Agent (The Notary)**: Packages the raw findings into an executive enterprise alert with precise citations to the source data (SQL rows and PDF pages).

## 💻 Tech Stack

### Frontend (React UI)
- **Framework**: React + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Glassmorphism & Enterprise aesthetics)
- **Real-time**: WebSockets (Live Audit Trail updates)

### Backend (AI Engine)
- **Framework**: FastAPI + Python 3
- **AI Orchestration**: LlamaIndex (Workflows, NLSQLTableQueryEngine, VectorStoreIndex)
- **LLM**: Google Gemini 3.1 Flash Lite
- **Databases**: 
  - PostgreSQL (via Supabase) for structured procurement data
  - ChromaDB for unstructured PDF vector embeddings

---

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** (v18+) and **npm**
- **Python** (v3.10+)
- **Google AI Studio API Key** (for Gemini)
- **Supabase Database URL** (PostgreSQL)

### 1. Backend Setup (FastAPI + LlamaIndex)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the required Python dependencies:
   ```bash
   pip install fastapi uvicorn llama-index llama-index-llms-google-genai llama-index-embeddings-google-genai llama-index-vector-stores-chroma chromadb sqlalchemy psycopg2-binary python-dotenv
   ```
3. Create a `.env` file in the root of the project (or backend folder) and add your keys:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   SUPABASE_DB_URL=postgresql://user:password@host:port/postgres
   ```
4. Start the FastAPI development server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```
   *The backend will now be running on http://localhost:8000*

### 2. Frontend Setup (React + Vite)

1. Open a **new, separate terminal** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the Dashboard:
   Open your browser and navigate to `http://localhost:5173`. 

---

## 🧪 Usage Example

1. Ensure both the backend and frontend servers are running.
2. In the HybridMind chat interface, type:
   > *"Run Q1 compliance audit on Apex Chemicals"*
3. Watch the **Live Audit Trail** on the right panel as the Executor, Verifier, and Chronicler agents dynamically stream their actions and raw data sources in real-time.

---

*Built for enterprise data integrity, transforming silent leakage into actionable insights.*