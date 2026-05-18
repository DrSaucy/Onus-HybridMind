# HybridMind

**AI-powered procurement audit intelligence for enterprise compliance.**

HybridMind is a multi-agent AI system that automatically detects financial leakage by cross-referencing structured SQL procurement records against unstructured vendor contracts. It surfaces discrepancies, calculates rebate obligations, and delivers transparent audit trails — in real time.

---

## How It Works

HybridMind runs an event-driven, three-stage agent pipeline triggered by a natural language prompt:

1. **Executor Agent** — Translates the user's request into SQL queries against a live PostgreSQL database (Supabase). Simultaneously retrieves relevant contract clauses from a ChromaDB vector store. Returns raw SQL results and verbatim contract excerpts with source metadata.

2. **Verifier Agent** — Receives both data sources and performs logical validation: does the vendor's actual purchase volume exceed the rebate threshold stated in the contract? Produces a structured JSON verdict with financial metrics.

3. **Chronicler Agent** — Packages the verified finding into a final audit event. Broadcasts a signed alert to the Live Audit Trail with the source citations, discrepancy amount, and compliance status.

Each step is broadcast over WebSocket in real time, so the frontend renders progress as it happens.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React + Vite (TypeScript) |
| Styling | Tailwind CSS + `@tailwindcss/typography` |
| Markdown Rendering | `react-markdown` |
| Backend Framework | FastAPI (Python 3) |
| AI Orchestration | LlamaIndex Workflows |
| Language Model | Google Gemini 3.1 Flash Lite |
| Structured Data | PostgreSQL via Supabase |
| Unstructured Data | ChromaDB (vector embeddings) |
| Embeddings | Google Gemini Embedding 2 |
| Real-time Transport | WebSocket (`/ws/audit`) |

---

## Project Structure

```
Onus-HybridMind/
├── backend/
│   ├── main.py              # FastAPI app, WebSocket manager, /chat endpoint
│   ├── workflow.py          # 3-Agent AuditWorkflow (Executor, Verifier, Chronicler)
│   ├── sql_tool.py          # NLSQLTableQueryEngine over Supabase PostgreSQL
│   ├── chroma_tool.py       # VectorStoreIndex over ChromaDB
│   ├── agent.py             # Legacy ReActAgent (retained for reference)
│   ├── setup_postgres.py    # Seeds the q1_procurement table with mock data
│   ├── setup_chroma.py      # Ingests vendor contracts into ChromaDB
│   ├── data/
│   │   └── apex_contract_2026.txt   # Sample vendor contract
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── App.tsx                  # Main application shell
│       │   └── components/
│       │       ├── ChatMessage.tsx       # Chat bubble with ReactMarkdown renderer
│       │       ├── AuditCard.tsx         # Live audit event card
│       │       ├── StatusPill.tsx        # Agent status indicator
│       │       └── ThemeToggle.tsx       # Light/dark mode switch
│       ├── assets/                       # Logo and AI avatar images
│       └── styles/                       # Tailwind + theme config
├── .env                      # API keys and database URL (not committed)
├── .gitignore
└── README.md
```

---

## Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- A Google AI Studio API key ([aistudio.google.com](https://aistudio.google.com))
- A Supabase project with a PostgreSQL connection string

---

## Setup

### 1. Environment Variables

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_google_api_key
SUPABASE_DB_URL=postgresql://user:password@host:port/postgres
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt

# Seed the database (run once)
python setup_postgres.py

# Ingest vendor contracts into ChromaDB (run once)
python setup_chroma.py

# Start the API server
python -m uvicorn main:app --reload --port 8000
```

### 3. Frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173`.

---

## Usage

With both servers running, type a natural language audit command in the chat interface:

```
Run Q1 compliance audit on Apex Chemicals
```

The system will:
- Execute a live SQL query against the procurement database
- Retrieve the relevant contract clause from ChromaDB
- Validate whether a rebate discrepancy exists
- Stream each agent's findings to the Live Audit Trail in real time
- Return a structured summary with financial metrics in the chat panel

The workflow supports any vendor present in the database. If no contract exists for a vendor in ChromaDB, the Verifier will correctly return a clean audit with no discrepancy.

---

## Data Sources

The system operates on two data sources:

**Structured (PostgreSQL — `q1_procurement` table)**
| Column | Type | Description |
|---|---|---|
| `vendor_name` | TEXT | Vendor name |
| `item_description` | TEXT | Item purchased |
| `unit_price` | NUMERIC | Price per unit |
| `quantity` | INT | Units purchased |
| `total_paid` | NUMERIC | Total expenditure |
| `date` | DATE | Transaction date |

**Unstructured (ChromaDB)**
Plain-text vendor contracts ingested via `setup_chroma.py`. The vector store retrieves the most semantically relevant clause given the audit query.

---

## License

See [LICENSE](./LICENSE).