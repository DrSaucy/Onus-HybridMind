# HybridMind — Presentation PRD for Kimi AI

## Design Direction

**Overall Style:**
A dark, high-contrast enterprise theme. Think Bloomberg Terminal meets modern AI dashboard. Minimal clutter. Every slide should feel like a product, not a document.

**Color Palette:**
- Background: `#090E17` (near-black navy)
- Primary Accent: `#6366F1` (indigo-500)
- Secondary Accent: `#3B82F6` (blue-500)
- Text Primary: `#F1F5F9` (slate-100)
- Text Secondary: `#94A3B8` (slate-400)
- Warning / Highlight: `#EF4444` (red-500)
- Clean / Success: `#10B981` (emerald-500)

**Typography:**
- Headings: **Inter**, bold, letter-spacing tight. Size hierarchy: 48px / 36px / 24px
- Body: **Inter**, regular, 16–18px, line-height 1.6
- Code / monospace labels: `JetBrains Mono` or `Fira Code`, size 13–14px
- Avoid decorative fonts entirely

**Layout Rules:**
- Wide 16:9 slides, generous whitespace
- Max 3 main points per slide — no walls of text
- Use data callouts (large numbers) to anchor attention
- Subtle gradient lines or vertical bars as design accents, not heavy borders

---

## Slide 01 — Title Slide

**Title:**
HybridMind

**Subtitle:**
AI-Powered Procurement Audit Intelligence

**Supporting line:**
Detecting financial leakage at the intersection of structured data and unstructured contracts.

**Design Note:**
Full-bleed dark background. The word "HybridMind" should be in large bold white text with a faint indigo glow effect underneath. Bottom-left: team name / hackathon name / date. No bullet points. Minimalist.

---

## Slide 02 — The Problem

**Title:**
Silent Leakage. Visible Damage.

**3 Key Points:**
1. Enterprise procurement teams are bound by complex vendor contracts — rebate thresholds, volume discounts, and penalty clauses buried in dense legal documents.
2. SQL databases hold the transaction records, but no one cross-references them against contract terms at scale.
3. The result: millions in uncollected rebates, unenforced penalties, and compliance gaps — undetected until it's too late.

**Data Callout (large, styled):**
"Up to 5% of annual procurement spend is lost to undetected contract non-compliance."

**Design Note:**
Use a two-column layout: left side = problem text, right side = a stylized visual of a database on one side and a document on the other, separated by a gap with a red "disconnect" line between them.

---

## Slide 03 — The Solution

**Title:**
HybridMind

**One-liner:**
An autonomous AI audit agent that bridges structured SQL procurement data and unstructured vendor contracts — in real time.

**3 Value Propositions:**
- Automated cross-referencing: SQL records vs. contract clauses, without human intervention
- Real-time audit streaming: every reasoning step is visible as it happens
- Actionable output: financial metrics, source citations, and compliance verdicts — not just summaries

**Design Note:**
Center-aligned layout. The word "bridges" should visually connect two icons: a database icon and a document icon, connected by an animated-looking indigo line or arrow. The three value props below should be in small card-style boxes.

---

## Slide 04 — Architecture Overview

**Title:**
Three Agents. One Verdict.

**Agent Pipeline (left to right, connected):**

**[1] Executor Agent**
Role: The Gatherer
- Converts natural language to SQL, queries PostgreSQL (Supabase)
- Retrieves contract clauses from ChromaDB via vector search
- Returns raw data: SQL rows, verbatim contract text, source metadata

**[2] Verifier Agent**
Role: The Auditor
- Receives both data sources
- Applies strict logical rules: does quantity exceed contract threshold?
- Produces a structured JSON verdict with financial metrics

**[3] Chronicler Agent**
Role: The Notary
- Packages the finding into a signed audit event
- Broadcasts a real-time alert with amount owed, source citations, and compliance status

**Design Note:**
Horizontal flow diagram. Three dark-card boxes connected by arrow lines. Each card has the agent name, role, and 2–3 bullet points. Use indigo for Executor, amber for Verifier, red for Chronicler to mirror the live UI.

---

## Slide 05 — Live Demo Screenshot

**Title:**
Audit in Motion

**Content:**
Full-width screenshot of the HybridMind dashboard — split view with:
- Left panel: Chat showing the natural language input and the structured AI response with audit metrics
- Right panel: Live Audit Trail showing Executor, Verifier, and Chronicler cards with real data (SQL query, raw text snippet, discrepancy alert)

**Supporting caption (bottom of slide):**
"Every card in the audit trail is generated from live database queries and vector-retrieved contract text — not hardcoded."

**Design Note:**
The screenshot should take up 75–80% of the slide. Frame it with a subtle rounded border and a faint glow. No additional decoration. Let the product speak.

---

## Slide 06 — Technology Stack

**Title:**
Built on Production-Grade Infrastructure

**Two-column layout:**

**Left — AI / Backend**
- Google Gemini 3.1 Flash Lite — LLM for all three agents
- LlamaIndex Workflows — event-driven multi-agent orchestration
- FastAPI — async REST + WebSocket API
- ChromaDB — vector store for contract embeddings
- PostgreSQL (Supabase) — procurement transaction database

**Right — Frontend / Interface**
- React + Vite (TypeScript)
- Tailwind CSS — dark enterprise design system
- react-markdown — structured AI response rendering
- WebSocket — real-time audit trail streaming

**Design Note:**
Use two clean columns with icon or logo pill badges for each technology. Monospace font for tech names. No tables — use spaced list items with a subtle left border accent.

---

## Slide 07 — What Makes It Different

**Title:**
Not a Chatbot. An Auditor.

**3 Differentiators:**

**Transparent Reasoning**
Every agent broadcasts its raw inputs: the exact SQL executed, the verbatim contract clause retrieved, and the mathematical logic applied. Nothing is hidden.

**Dynamic, Not Scripted**
The system works for any vendor in the database. Contract terms are retrieved semantically, not by hardcoded rule. Verdicts are generated by the model, not pre-written.

**Enterprise-Grade Output**
Results are structured — vendor name, total quantity, total expenditure, rebate tier, amount owed — and delivered in a format ready for compliance reporting.

**Design Note:**
Three tall cards in a row, each with a short bold heading and 2–3 sentence explanation. Cards should have a very faint indigo-blue gradient border on the left edge. Generous padding inside.

---

## Slide 08 — Closing Slide

**Title:**
HybridMind

**Tagline:**
Turning silent leakage into documented liability.

**Bottom section:**
Built with LlamaIndex · Gemini · Supabase · ChromaDB · React

**Design Note:**
Mirror the title slide layout. Same dark background, same glow on the product name. Below the tagline, a single horizontal line separates the tech credits. Clean and confident. No "Thank You" text — end with the product name and the tagline.
