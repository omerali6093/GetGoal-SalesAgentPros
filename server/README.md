# SalesPilot AI — Backend

Node.js / Express / MongoDB backend for the SalesPilot AI sales intelligence
platform, with a **free, self-hostable LLM** (Ollama) and a **Retrieval-Augmented
Generation (RAG)** layer for generating opportunity insights and outreach drafts.

This backend is designed to plug directly into the SalesPilot AI React frontend,
replacing its mock data functions (`generateEmailDraft`, `getRecommendedServices`,
etc.) with real, AI-generated, data-grounded responses.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Folder Structure](#folder-structure)
3. [Getting Started](#getting-started)
4. [Environment Variables](#environment-variables)
5. [LLM Integration](#llm-integration)
6. [RAG Integration](#rag-integration)
7. [API Overview](#api-overview)
8. [Data Models](#data-models)
9. [Scripts](#scripts)
10. [Roadmap](#roadmap)

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Runtime | Node.js 18+ | |
| Framework | Express | |
| Database | MongoDB (Mongoose) | Also used as the vector store via Atlas Vector Search |
| LLM (local, free) | [Ollama](https://ollama.com) running `llama3.1:8b` or `mistral:7b` | No API key, no rate limits, runs on your own machine/VM |
| LLM (hosted, free tier) | [Groq](https://groq.com) — Llama 3.3 70B, Mixtral | Fallback/alternative if you don't want to self-host |
| Embeddings | Ollama `nomic-embed-text` | Keeps embeddings local and free |
| Vector search | MongoDB Atlas Vector Search | No extra vector DB needed — embeddings live alongside your existing documents |
| Auth | JWT | |
| Background jobs | Simple in-process queue (upgradeable to BullMQ + Redis) | For long-running discovery/audit/embedding jobs |

---

## Folder Structure

```
salespilot-backend/
├── src/
│   ├── config/
│   │   ├── db.js                     # MongoDB connection (mongoose.connect)
│   │   ├── env.js                    # Centralized env var loading/validation
│   │   └── constants.js              # Enums: industries, lead statuses, website statuses
│   │
│   ├── models/
│   │   ├── User.js                   # Agency users / auth
│   │   ├── Business.js               # Core business record
│   │   ├── WebsiteAudit.js           # Performance/mobile/SEO/accessibility/conversion scores
│   │   ├── Lead.js                   # Pipeline status, opportunity score, stage history
│   │   ├── Campaign.js               # Industry + location groupings, stats
│   │   ├── OutreachMessage.js        # Drafts per channel (email/whatsapp/linkedin)
│   │   ├── ActivityLog.js            # Timeline entries per lead/business
│   │   └── KnowledgeChunk.js         # { text, embedding[], sourceType, sourceId, metadata } — RAG store
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── business.controller.js
│   │   ├── discovery.controller.js   # Triggers AI discovery jobs
│   │   ├── audit.controller.js       # Website audit generation/results
│   │   ├── lead.controller.js        # Kanban stage transitions
│   │   ├── campaign.controller.js
│   │   ├── outreach.controller.js    # Draft generation + regenerate actions
│   │   ├── analytics.controller.js   # Aggregation endpoints for charts
│   │   ├── dashboard.controller.js   # Summary metrics endpoint
│   │   └── ai.controller.js          # /api/ai/insight, /api/ai/outreach, /api/ai/ask
│   │
│   ├── routes/
│   │   ├── index.js                  # Mounts all routers under /api
│   │   ├── auth.routes.js
│   │   ├── business.routes.js
│   │   ├── discovery.routes.js
│   │   ├── audit.routes.js
│   │   ├── lead.routes.js
│   │   ├── campaign.routes.js
│   │   ├── outreach.routes.js
│   │   ├── analytics.routes.js
│   │   ├── dashboard.routes.js
│   │   └── ai.routes.js
│   │
│   ├── services/
│   │   ├── discoveryService.js       # Business discovery logic (scraping/API providers)
│   │   ├── websiteAnalyzerService.js # Runs performance/SEO/mobile checks
│   │   ├── scoringService.js         # Opportunity score calculation
│   │   ├── aiInsightService.js       # Orchestrates RAG + LLM calls for insights/drafts
│   │   └── analyticsService.js       # Aggregation pipelines for charts
│   │
│   ├── ai/
│   │   ├── config/
│   │   │   └── llmConfig.js          # Picks provider from .env: "ollama" | "groq"
│   │   │
│   │   ├── providers/
│   │   │   ├── ollamaProvider.js     # Calls local Ollama /api/generate + /api/embeddings
│   │   │   ├── groqProvider.js       # Calls Groq's OpenAI-compatible chat completions
│   │   │   └── llmProvider.js        # Unified interface — generate(), embed()
│   │   │
│   │   ├── rag/
│   │   │   ├── documentLoader.js     # Turns Business/WebsiteAudit/Campaign docs into text chunks
│   │   │   ├── chunker.js            # Splits long text (audits, playbooks) into chunks
│   │   │   ├── vectorStore.js        # Wraps Mongo Atlas Vector Search ($vectorSearch queries)
│   │   │   ├── retriever.js          # topK similarity search given a query embedding
│   │   │   └── ragPipeline.js        # embed(query) → retrieve() → buildPrompt() → llm.generate()
│   │   │
│   │   └── prompts/
│   │       ├── opportunityInsight.prompt.js  # "Why this business is an opportunity"
│   │       ├── outreachDraft.prompt.js       # Email/WhatsApp/LinkedIn draft generation
│   │       ├── outreachRefine.prompt.js      # Shorter / more professional / personalized
│   │       └── auditSummary.prompt.js        # Plain-English summary of audit scores
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js        # JWT/session verification
│   │   ├── error.middleware.js       # Centralized error handler
│   │   ├── validate.middleware.js    # Request schema validation (zod/joi)
│   │   └── rateLimiter.middleware.js
│   │
│   ├── jobs/
│   │   ├── discoveryQueue.js         # Background job for long-running discovery runs
│   │   ├── auditQueue.js             # Background job for website audits
│   │   └── embeddingQueue.js         # Background job for embedding new documents into RAG store
│   │
│   ├── validators/
│   │   ├── business.validator.js
│   │   ├── lead.validator.js
│   │   ├── campaign.validator.js
│   │   └── outreach.validator.js
│   │
│   ├── utils/
│   │   ├── apiResponse.js            # Consistent { success, data, error } wrapper
│   │   ├── logger.js
│   │   └── pagination.js
│   │
│   ├── app.js                        # Express app setup (middleware, routes mounted)
│   └── server.js                     # Entry point — starts HTTP server + DB connection
│
├── scripts/
│   └── seedKnowledgeBase.js          # One-off: embeds existing businesses/audits/playbooks into KnowledgeChunk
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── docker-compose.yml                # Spins up Ollama alongside the API (optional)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### 1. Prerequisites

- Node.js 18+
- MongoDB (Atlas cluster recommended — needed for Vector Search)
- [Ollama](https://ollama.com) installed locally, **or** a free Groq API key

### 2. Install Ollama models (if using the local, free path)

```bash
# install Ollama: https://ollama.com/download
ollama pull llama3.1:8b
ollama pull nomic-embed-text
ollama serve
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment

```bash
cp .env.example .env
# then fill in MONGODB_URI, LLM_PROVIDER, etc.
```

### 5. Seed the RAG knowledge base

```bash
node scripts/seedKnowledgeBase.js
```

This chunks and embeds existing `Business`, `WebsiteAudit`, and sales-playbook
documents into the `KnowledgeChunk` collection so retrieval has something to
search against on day one.

### 6. Run the server

```bash
npm run dev      # nodemon, local development
npm start        # production
```

---

## Environment Variables

```bash
# Server
PORT=5000
NODE_ENV=development
JWT_SECRET=change_me

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/salespilot

# LLM provider: "ollama" (free, local) or "groq" (free tier, hosted)
LLM_PROVIDER=ollama

# Ollama (local)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
OLLAMA_EMBED_MODEL=nomic-embed-text

# Groq (hosted, only needed if LLM_PROVIDER=groq)
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile

# RAG
RAG_TOP_K=5
RAG_CHUNK_SIZE=500
RAG_CHUNK_OVERLAP=50
VECTOR_INDEX_NAME=knowledge_vector_index
```

---

## LLM Integration

The backend never talks to a specific LLM SDK directly — every controller and
service goes through `src/ai/providers/llmProvider.js`, a thin interface with
two methods:

```js
llmProvider.generate({ prompt, system, temperature })   // -> string
llmProvider.embed(text)                                 // -> number[]
```

`llmConfig.js` reads `LLM_PROVIDER` from `.env` and routes calls to either:

- **`ollamaProvider.js`** — POSTs to `http://localhost:11434/api/generate` and
  `/api/embeddings`. Fully free, fully local, no external network calls, no
  usage caps. This is the default and recommended provider.
- **`groqProvider.js`** — Uses Groq's OpenAI-compatible `/chat/completions`
  endpoint with a free-tier API key. Useful if you'd rather not run a model
  locally, or want faster responses on constrained hardware.

Because both providers implement the same interface, swapping
`LLM_PROVIDER=ollama` → `LLM_PROVIDER=groq` (or adding a third provider later,
e.g. a different free host) requires no changes anywhere else in the codebase.

---

## RAG Integration

RAG is used everywhere the app needs to generate text that should be **grounded
in real business/audit data** rather than the model's own guesses — opportunity
insights, outreach drafts, and audit summaries.

### Why RAG here specifically

A generic LLM call like "write an outreach email to a dental clinic" produces
generic copy. RAG retrieves the *actual* business record, its *actual* audit
scores, similar businesses the agent has seen before, and relevant snippets
from a sales playbook — then feeds all of that into the prompt so the
generated text is specific and accurate.

### Pipeline (`src/ai/rag/ragPipeline.js`)

```
                 ┌────────────────────┐
  query/context  │  1. Embed query    │   llmProvider.embed(query)
  ─────────────► │     (Ollama)       │
                 └─────────┬──────────┘
                            │ query vector
                            ▼
                 ┌────────────────────┐
                 │  2. Vector search   │   MongoDB $vectorSearch
                 │     (vectorStore)   │   over KnowledgeChunk.embedding
                 └─────────┬──────────┘
                            │ top-K chunks
                            ▼
                 ┌────────────────────┐
                 │  3. Build prompt    │   prompts/*.prompt.js
                 │  (business data +   │   inserts retrieved chunks +
                 │   retrieved chunks) │   structured business fields
                 └─────────┬──────────┘
                            │ final prompt
                            ▼
                 ┌────────────────────┐
                 │  4. Generate        │   llmProvider.generate()
                 │     (Ollama/Groq)   │
                 └─────────┬──────────┘
                            │
                            ▼
                   Insight / draft text
                   returned to frontend
```

### What gets embedded into the knowledge base

| Source | Chunked into `KnowledgeChunk` as |
|---|---|
| `Business` documents | "ABC Dental Clinic is a Healthcare business in Lahore with a website scoring 52/100 on performance..." |
| `WebsiteAudit` documents | Issue summaries and score breakdowns |
| Hand-written sales playbooks (`/scripts/playbooks/*.md`, optional) | Best-practice outreach angles per industry |
| Past successful outreach messages (once you have them) | Style/tone examples for the LLM to draw from |

### Example: generating an "opportunity insight"

1. Frontend requests `POST /api/ai/insight/:businessId`.
2. `ai.controller.js` calls `aiInsightService.generateOpportunityInsight(businessId)`.
3. The service builds a retrieval query from the business's industry + website
   issues (e.g. `"dental clinic outdated website mobile poor conversion"`).
4. `ragPipeline.js` embeds that query, retrieves the top 5 relevant chunks
   (similar businesses, relevant playbook advice), and builds the final prompt
   using `prompts/opportunityInsight.prompt.js`.
5. `llmProvider.generate()` returns natural-language text like the
   "Why this business is an opportunity" card on the frontend.
6. The result is cached on the `Business` document so it isn't regenerated on
   every page load.

### Example: outreach draft + refine actions

- `POST /api/ai/outreach/:businessId?channel=email` → RAG-grounded first draft
  (replaces `generateEmailDraft()` in the frontend mock data).
- `POST /api/ai/outreach/:draftId/refine` with `{ mode: "shorter" | "professional" | "personalized" }`
  → re-prompts the LLM with the existing draft + a refine instruction from
  `outreachRefine.prompt.js`, without re-running retrieval (cheaper and faster
  than a full RAG pass).

### Keeping the vector index fresh

`embeddingQueue.js` listens for new/updated `Business` and `WebsiteAudit`
documents and automatically re-embeds and upserts their `KnowledgeChunk`
entries, so newly discovered businesses become part of the retrievable
knowledge base without a manual reseed.

---

## API Overview

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate agency user |
| `GET` | `/api/dashboard/summary` | Metrics for the Dashboard page |
| `POST` | `/api/discovery/run` | Start a new AI discovery search |
| `GET` | `/api/businesses` | List/filter businesses |
| `GET` | `/api/businesses/:id` | Business detail + audit |
| `GET` | `/api/leads` | Kanban pipeline data |
| `PATCH` | `/api/leads/:id/stage` | Move a lead between pipeline stages |
| `GET` | `/api/campaigns` | List campaigns |
| `POST` | `/api/campaigns` | Create a campaign |
| `GET` | `/api/analytics/:chart` | Chart data (leads, funnel, distributions) |
| `POST` | `/api/ai/insight/:businessId` | RAG-generated opportunity insight |
| `POST` | `/api/ai/outreach/:businessId` | RAG-generated outreach draft |
| `POST` | `/api/ai/outreach/:draftId/refine` | Refine an existing draft |
| `POST` | `/api/ai/ask` | Free-form RAG question over the knowledge base |

---

## Data Models

Key fields relevant to AI/RAG (full schemas live in `src/models/`):

```js
// KnowledgeChunk.js
{
  text: String,            // the chunked, embeddable text
  embedding: [Number],     // vector from Ollama nomic-embed-text
  sourceType: String,      // "business" | "audit" | "playbook" | "outreach_example"
  sourceId: ObjectId,      // reference back to the source document
  metadata: {
    industry: String,
    location: String,
  },
  createdAt: Date,
}
```

```js
// Business.js (relevant fields)
{
  name: String,
  industry: String,
  location: String,
  websiteStatus: String,
  scores: { performance, mobile, seo, accessibility, conversion },
  opportunityScore: Number,
  aiInsight: String,       // cached RAG-generated insight
  aiInsightGeneratedAt: Date,
}
```

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start server with nodemon |
| `npm start` | Start server (production) |
| `node scripts/seedKnowledgeBase.js` | Embed existing data into the RAG store |
| `npm test` | Run unit + integration tests |

---

## Roadmap

- [ ] Swap in-process job queue for BullMQ + Redis for production-scale discovery/embedding jobs
- [ ] Add a second embedding fallback (e.g. `bge-small`) for lower-memory environments
- [ ] Add streaming responses for outreach draft generation (SSE) to the frontend
- [ ] Add per-agency knowledge bases (multi-tenant vector filtering by `agencyId`)
- [ ] Evaluate self-hosted reranking (e.g. `bge-reranker`) to improve retrieval precision before generation



## PHASES FOR DEVELOPING BACKEND
Phase 0  Bootstrap                  ──► server runs
Phase 1  Models                     ──► collections exist
Phase 2  Auth                       ──► protected routes work
Phase 3  Core CRUD                  ──► frontend renders real data
Phase 4  Discovery/audit scoring    ──► real leads get generated
Phase 5  LLM provider               ──► one working generate() call
Phase 6  RAG storage/retrieval      ──► similarity search works
Phase 7  RAG pipeline + prompts     ──► grounded generation works
Phase 8  AI endpoints               ──► frontend AI features go live
Phase 9  Embedding freshness jobs   ──► new data stays searchable
Phase 10 Hardening                  ──► tests, rate limits, docker