# RecruitAI — Production Architecture

> AI-powered resume analysis, ATS optimization, interview preparation, and job
> recommendation platform.
>
> This document is the single source of truth for the system design. Section
> 16 gives the build order and current status — **Phases 1–4 (Foundation &
> Auth, Resume Pipeline, Embeddings, ATS Engine) are built and verified
> end-to-end. Phase 5 (Interviews & Chat) is next.** Section 15 is a
> historical record of the original code cleanup done at the start of
> Phase 1 (now resolved).

---

## 1. Vision

RecruitAI helps a job seeker:

- Upload a resume (PDF/DOCX) and get it parsed into structured data
- Get an ATS compatibility score against a specific job description
- See missing keywords / skill gaps
- Generate and practice interview questions (technical + behavioral), with AI feedback
- Chat with an AI career assistant that has access to their resume context
- Match their resume against job descriptions using semantic (vector) search

**Target users:** students, freshers, experienced developers, recruiters, HR teams.

---

## 2. System Architecture

```
┌────────────────────┐        HTTPS/JSON        ┌──────────────────────┐
│   Next.js Frontend │ ───────────────────────▶ │     FastAPI Backend  │
│  (App Router, TS)  │ ◀─────────────────────── │   (api/v1/* routers) │
└────────────────────┘                          └──────────┬────────────┘
                                                             │
                    ┌────────────────────────────────────────┼──────────────────────────┐
                    ▼                        ▼                ▼                          ▼
           ┌────────────────┐      ┌────────────────┐  ┌────────────┐         ┌────────────────────┐
           │   PostgreSQL   │      │      Redis      │  │   Qdrant   │         │    arq Workers      │
           │ (system of     │      │ cache + broker  │  │ (vector    │         │ (async: parsing,    │
           │  record)       │      │ + rate limiting │  │  search)   │         │  embeddings, email) │
           └────────────────┘      └────────┬────────┘  └────────────┘         └──────────┬───────────┘
                                             │                                             │
                                             └───────────────── task queue ─────────────────┘
                                                                                             │
                                                                                             ▼
                                                                              ┌───────────────────────────┐
                                                                              │  LLM Providers (pluggable) │
                                                                              │  OpenAI / Gemini / Anthropic│
                                                                              └───────────────────────────┘
```

**Why this shape:**

- **FastAPI stays synchronous-request / async-work split.** Anything slow
  (PDF parsing, NLP, embeddings, LLM calls, emails) must never block an HTTP
  request — it goes through **arq + Redis** so the API responds in
  milliseconds and the client polls or gets notified when the job finishes.
- **Postgres is the only system of record** for anything you must never lose
  or must query relationally (users, resumes, jobs, scores). **Qdrant** only
  stores vectors + a pointer back to the Postgres row — never source-of-truth
  data. This means Qdrant can be wiped and rebuilt from Postgres at any time.
- **Redis does three jobs**, not one: arq broker/result backend, response
  cache (e.g. cached ATS results), and a token bucket for rate limiting. One
  running service, three responsibilities — avoids adding more infra.

---

## 3. Technology Stack & Why

| Concern | Choice | Why this over the alternative |
| --- | --- | --- |
| API framework | **FastAPI** | Native async, Pydantic-validated request/response, auto OpenAPI docs (you get a working Swagger UI for free, which doubles as frontend contract docs). Already adopted — keep it. |
| DB driver/ORM | **SQLAlchemy 2.0** (sync) | Mature, typed 2.0 API, works with Alembic. Async SQLAlchemy (`asyncpg`) is faster under high concurrency but adds real complexity (async sessions everywhere, async-safe libraries only); not worth it until you have measured DB-bound latency. Revisit post-launch if load testing shows the DB is the bottleneck. |
| Migrations | **Alembic** | You currently use `Base.metadata.create_all()` in `main.py` — fine for a prototype, unsafe once real user data exists (no way to alter a column without dropping data). Alembic gives versioned, reversible schema changes. **Must land before Phase 1 auth changes.** |
| Password hashing | **passlib[bcrypt]** | Already in `requirements.txt`, unused. bcrypt is the industry baseline — adaptive cost factor, salts automatically, no known practical break. |
| Tokens | **PyJWT** | Already installed. Short-lived access token (15 min) + longer-lived refresh token (7–30 days), rotated on use. |
| Background jobs | **arq + Redis** — *not built yet, still fully synchronous* | Planned for when resume/job processing is actually slow enough to justify it (per the "sync first" rule below). As of Phase 4, upload→parse and job-create→embed still run inline inside the request and haven't needed to move off it — no Redis, no worker process exists in the stack yet. Revisit if upload latency becomes a real problem. |
| Vector search | **Qdrant** — **built** | Self-hosted via Docker Compose (`recruit-ai-qdrant`), two collections (`resumes`, `jobs`), 384-dim vectors, cosine distance. Verified working via direct Qdrant search queries (§7). |
| Embeddings | **`fastembed`** (`BAAI/bge-small-en-v1.5`), local — **built**, swapped from the originally-planned `sentence-transformers` | Same $0-cost reasoning as before, but `fastembed` (built by the Qdrant team, ONNX-based) avoids pulling in full PyTorch, which `sentence-transformers` requires — meaningfully smaller Docker image and faster cold start, better fit for a small self-hosted VM. Model cache persisted under `backend/.fastembed_cache` (bind-mounted) so it isn't re-downloaded on every container rebuild. |
| LLM orchestration | Direct OpenAI SDK behind a **`LLMProvider` interface** — **built** | `services/llm/base_provider.py` (interface) + `services/llm/openai_provider.py` (only adapter, `gpt-4o-mini`). Currently wired into the ATS suggestion flow only; Interviews/Chat (Phase 5) will reuse the same interface. |
| Resume parsing | **PyMuPDF** (PDF) + **python-docx** (DOCX) — **built**; keyword/skill extraction is a curated word-list, **not spaCy yet** | Name/email/phone via regex, skills via word-boundary-safe matching (`services/keyword_service.py`) against a ~85-term curated list (`core/constants.py`) spanning languages/frameworks/cloud/data/testing. Deliberately simple — spaCy NER (for name extraction) and a broader open skill taxonomy (for domain coverage beyond tech) are known, still-free upgrades, not yet built. |
| Rate limiting | **slowapi** (Redis-backed) | Protects `/auth/login` (brute force) and `/resumes` (upload abuse) cheaply, reuses the Redis you already run. |
| Logging | **structlog** | JSON-structured logs are what you actually query in production (grep-able, filterable by request id), plain `print`/stdlib logging is not. |
| Error tracking | **Sentry SDK** | Free tier is enough at your scale; without it, prod exceptions are invisible until a user complains. |
| Testing | **pytest + httpx (ASGITransport)** | `httpx`'s ASGI transport lets you test FastAPI endpoints in-process, no live server needed — fast test suite. |
| Linting/formatting | **ruff** | One tool replaces flake8 + isort + black-equivalent checks, order-of-magnitude faster. |
| Frontend data fetching | **TanStack Query** | Server-state caching, dedupe, background refetch, retry — you need this the moment you have more than one screen reading the same resume/job data. |
| Frontend client state | **Zustand** | Minimal boilerplate vs Redux Toolkit for the small amount of client-only state (current user, UI toggles) this app needs. |
| Frontend forms | **react-hook-form + zod** | Zod schemas can mirror your Pydantic schemas 1:1 (same shape), and RHF avoids re-rendering the whole form per keystroke. |
| Frontend styling | **Tailwind CSS + shadcn/ui** | Fast to build consistent UI without hand-rolling a design system; shadcn components are copy-in (no opaque dependency to fight later). |

---

## 4. Backend Target Folder Structure

```text
backend/
├── alembic/
│   ├── versions/
│   └── env.py
│
├── api/
│   ├── v1/
│   │   ├── endpoints/
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── resumes.py
│   │   │   ├── jobs.py
│   │   │   ├── ats.py
│   │   │   ├── interviews.py
│   │   │   └── chat.py
│   │   └── router.py            # aggregates all endpoint routers
│   │
│   ├── dependencies/
│   │   ├── database.py          # get_db
│   │   ├── auth.py              # get_current_user, require_role
│   │   └── pagination.py        # shared page/limit query params
│   │
│   └── middleware/
│       ├── error_handler.py     # global exception → JSON error shape
│       ├── logging_middleware.py
│       └── rate_limiter.py
│
├── core/
│   ├── config.py                # Settings (env-driven)
│   ├── constants.py              # enums, file-size limits, etc.
│   ├── security.py               # hash_password, verify_password, create/verify JWT
│   ├── logger.py                 # structlog config
│   └── exceptions.py             # AppError hierarchy (NotFound, Unauthorized, …)
│
├── database/
│   └── session.py                # ONE engine + SessionLocal (drop database/database.py duplicate)
│
├── models/                       # SQLAlchemy ORM models — one file per aggregate
│   ├── base.py
│   ├── user.py
│   ├── resume.py
│   ├── job.py
│   ├── ats_score.py
│   ├── interview.py
│   └── chat.py
│
├── schemas/                       # Pydantic request/response contracts
│   ├── auth.py
│   ├── user.py
│   ├── resume.py
│   ├── job.py
│   ├── ats.py
│   ├── interview.py
│   └── chat.py
│
├── repositories/                  # DB access only, no business logic
│   ├── base_repository.py
│   ├── user_repository.py
│   ├── resume_repository.py
│   ├── job_repository.py
│   ├── ats_repository.py
│   └── interview_repository.py
│
├── services/                      # business logic, orchestration
│   ├── auth_service.py
│   ├── user_service.py
│   ├── resume_service.py
│   ├── parsing_service.py         # text → structured (name/skills/education/exp)
│   ├── embedding_service.py        # text → vector, Qdrant upsert/query
│   ├── ats_service.py
│   ├── job_service.py
│   ├── interview_service.py
│   ├── chat_service.py
│   ├── usage_tracker.py            # §17 — records estimated LLM cost per call, enforces budget ceiling
│   └── llm/
│       ├── base_provider.py        # LLMProvider interface
│       └── openai_provider.py      # gpt-4o-mini adapter (only provider built for now)
│
├── workers/
│   ├── arq_worker.py                # WorkerSettings + cron_jobs (replaces Celery app + beat)
│   └── tasks/
│       ├── resume_tasks.py         # parse_resume, embed_resume
│       ├── ats_tasks.py
│       ├── interview_tasks.py
│       └── email_tasks.py
│
├── utils/
│   ├── file_handler.py             # save/validate upload, size/type checks
│   ├── pdf_extractor.py
│   ├── docx_extractor.py
│   └── text_cleaner.py
│
├── uploads/resumes/
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_resumes.py
│   └── ...
│
├── main.py
├── requirements.txt
└── Dockerfile
```

---

## 5. Database Schema

Postgres, SQLAlchemy 2.0 models, Alembic-managed. UUID primary keys for
every user-facing entity (resumes, jobs, sessions) — sequential integer IDs
in a public URL let anyone enumerate `/resumes/1`, `/resumes/2`, ...; UUIDs
close that off for free. Internal-only join tables can stay integer.

```text
users
├── id            UUID PK
├── name           varchar
├── email          varchar  UNIQUE, indexed
├── hashed_password varchar
├── role           enum(user, recruiter, admin)  default 'user'
├── is_active      boolean  default true
├── is_verified    boolean  default false
├── created_at     timestamptz
└── updated_at     timestamptz

refresh_tokens
├── id             UUID PK
├── user_id        UUID FK -> users.id, indexed
├── token_hash     varchar          -- store hash, never raw token
├── expires_at     timestamptz
├── revoked        boolean default false
└── created_at     timestamptz

resumes                              -- built
├── id             UUID PK
├── user_id        UUID FK -> users.id, indexed
├── filename       varchar
├── file_path      varchar
├── file_type      enum(pdf, docx)
├── raw_text       text
├── parsed_data    jsonb     -- {email, phone, skills[]} — name/education/experience not yet extracted (needs spaCy, §3)
├── status         enum(uploaded, parsing, parsed, failed)
├── created_at     timestamptz
└── updated_at     timestamptz

jobs                                 -- built
├── id             UUID PK
├── created_by     UUID FK -> users.id, indexed   -- NOT nullable in the build (every job has an owner; no public/system jobs yet)
├── title          varchar
├── company        varchar nullable
├── description    text
├── extracted_keywords jsonb    -- list[str], same curated skill-list matcher as resumes.parsed_data.skills
├── status         enum(pending, processing, ready, failed)
├── created_at     timestamptz
└── updated_at     timestamptz

ats_scores                           -- built
├── id             UUID PK
├── resume_id      UUID FK -> resumes.id, indexed
├── job_id         UUID FK -> jobs.id, indexed   -- NOT nullable in the build (generic no-JD scoring isn't implemented)
├── score          float     -- 0–100, = 0.6×cosine_similarity + 0.4×keyword_coverage (100% similarity-only if the job has zero extracted keywords)
├── missing_keywords jsonb   -- job keywords not found in resume.parsed_data.skills
├── suggestions    jsonb     -- list[str], gpt-4o-mini output
├── created_at     timestamptz

interview_sessions                   -- planned, Phase 5, not yet built
├── id             UUID PK
├── user_id        UUID FK -> users.id, indexed
├── resume_id      UUID FK -> resumes.id, nullable
├── job_id         UUID FK -> jobs.id, nullable
├── difficulty     enum(easy, medium, hard)
├── status         enum(in_progress, completed)
├── created_at     timestamptz
└── updated_at     timestamptz

interview_questions                  -- planned, Phase 5, not yet built
├── id             UUID PK
├── session_id     UUID FK -> interview_sessions.id, indexed
├── question_text  text
├── question_type  enum(technical, behavioral)
├── user_answer    text nullable
├── ai_feedback    text nullable
├── score          float nullable
└── created_at     timestamptz

chat_sessions                        -- planned, Phase 5, not yet built
├── id             UUID PK
├── user_id        UUID FK -> users.id, indexed
├── resume_id      UUID FK -> resumes.id, nullable   -- context anchor
├── title          varchar
└── created_at     timestamptz

chat_messages                        -- planned, Phase 5, not yet built
├── id             UUID PK
├── session_id     UUID FK -> chat_sessions.id, indexed
├── role           enum(user, assistant)
├── content        text
└── created_at     timestamptz

llm_usage_log                        -- built (§17 cost governance)
├── id             UUID PK
├── user_id        UUID FK -> users.id, nullable, indexed
├── feature        enum(ats_suggestions)   -- will grow: interview_generate, interview_evaluate, chat (Phase 5)
├── input_tokens   int
├── output_tokens  int
├── estimated_cost_usd  numeric(10,6)
└── created_at     timestamptz
```

Note: no `qdrant_point_id` column on `resumes`/`jobs` — the row's own UUID `id`
doubles as the Qdrant point ID directly (§3 design note), so there's nothing
separate to keep in sync.

**Design notes:**

- `resumes.status` is the state machine that lets the frontend show
  "Parsing…" / "Ready" without polling three different tables — one field,
  driven by the arq pipeline (§7).
- `llm_usage_log` exists purely to let `usage_tracker` (§17) answer "how much
  of the $5 credit is left" without calling OpenAI's billing API — every LLM
  call writes one row here with its token counts and an estimated cost, and
  `ensure_budget_available` sums this table before every OpenAI call.
- `ats_scores.job_id` is required in the build (not nullable as originally
  planned) — a "generic ATS check with no job" mode was never built; every
  score is always resume-vs-a-specific-job.
- No `DELETE` on `users`/`resumes` in normal operation — add `deleted_at`
  (soft delete) if you need "remove my account" later; keeps foreign-key
  history intact for `ats_scores`/`interview_sessions` audit trails.

---

## 6. API Reference (v1)

All routes prefixed `/api/v1`. Auth via `Authorization: Bearer <access_token>`
unless marked public. Auth/Users/Resumes/Jobs/ATS are **built and verified**;
Interviews/Chat are **planned (Phase 5)**, not yet implemented.

### Auth (`/auth`) — built

| Method | Path | Auth | Request | Response |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | public | `{name, email, password}` | `{id, name, email, role, is_active, is_verified}` |
| POST | `/auth/login` | public | `{email, password}` | `{access_token, refresh_token, token_type}` |
| POST | `/auth/refresh` | refresh token | `{refresh_token}` | `{access_token, refresh_token}` (old refresh token revoked — rotation) |
| POST | `/auth/logout` | — | `{refresh_token}` | `204` (revokes that refresh token) |
| GET | `/auth/me` | bearer | — | `{id, name, email, role, is_active, is_verified}` |

### Users (`/users`) — built

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/users/me` | bearer | current profile |
| PATCH | `/users/me` | bearer | update name/email |

### Resumes (`/resumes`) — built

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/resumes` | bearer | multipart upload; validates size/type; parses + embeds **synchronously inline** (arq not built yet, §10) before responding with the final `status` |
| GET | `/resumes` | bearer | list current user's resumes (paginated) |
| GET | `/resumes/{id}` | bearer, owner | full record incl. `parsed_data`, `status` |
| DELETE | `/resumes/{id}` | bearer, owner | removes file + DB row + Qdrant point |
| POST | `/resumes/{id}/reparse` | bearer, owner | re-run parse+embed against the already-stored file |

### Jobs (`/jobs`) — built

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/jobs` | bearer | create job description, keyword extraction + embedding run synchronously inline |
| GET | `/jobs` | bearer | list current user's jobs (paginated) |
| GET | `/jobs/{id}` | bearer, owner | detail |
| DELETE | `/jobs/{id}` | bearer, owner | removes DB row + Qdrant point |

### ATS (`/ats`) — built

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/ats/analyze` | bearer | `{resume_id, job_id}` (both required — no-JD generic scoring isn't built) → synchronous: cosine similarity + keyword diff + one `gpt-4o-mini` call, budget-checked via `usage_tracker` first |
| GET | `/ats/{id}` | bearer, owner | one result |
| GET | `/ats/resume/{resume_id}` | bearer, owner | history of scores for a resume |

### Interviews (`/interviews`) — planned, Phase 5

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/interviews/generate` | bearer | `{resume_id?, job_id?, difficulty}` → **one** LLM call generates a fixed, capped set of questions (default 5), bulk-inserted; no per-question calls |
| GET | `/interviews/{session_id}` | bearer | session + questions |
| POST | `/interviews/{session_id}/answer` | bearer | `{question_id, answer}` → stores answer only, **no LLM call here** (feedback is batched, see `/evaluate`) |
| POST | `/interviews/{session_id}/evaluate` | bearer | **one** LLM call evaluates all answers together → per-question feedback/score + overall summary, marks session `completed` |

### Chat (`/chat`) — planned, Phase 5

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/chat/sessions` | bearer | `{resume_id?}` → new session |
| POST | `/chat/sessions/{id}/messages` | bearer | `{content}` → appends user msg, calls LLM with resume context, appends assistant reply, returns both |
| GET | `/chat/sessions/{id}` | bearer | full message history |

---

## 7. Data Flow — Resume Upload to ATS Result

```
Client                FastAPI              Postgres           arq Worker           Qdrant           LLM
  │  POST /resumes       │                    │                   │                │              │
  │─────────────────────▶│                    │                   │                │              │
  │                      │ save file to disk  │                   │                │              │
  │                      │ insert resume row   │                   │                │              │
  │                      │ status=uploaded ───▶│                   │                │              │
  │                      │ enqueue parse_resume(resume_id) ───────▶│                │              │
  │  201 {id, status}    │                    │                   │                │              │
  │◀─────────────────────│                    │                   │                │              │
  │                      │                    │  status=parsing ◀─│                │              │
  │                      │                    │                   │ extract text    │              │
  │                      │                    │                   │ (pdf/docx)      │              │
  │                      │                    │                   │ skill matcher → │              │
  │                      │                    │                   │ parsed_data     │              │
  │                      │                    │  save parsed_data │                │              │
  │                      │                    │  status=parsed ◀──│                │              │
  │                      │                    │                   │ generate embed  │              │
  │                      │                    │                   │───────────────▶│ upsert vector│
  │                      │                    │  (status stays parsed — no separate │              │
  │                      │                    │   point-id column, id doubles as it)│              │
  │  GET /resumes/{id}   │                    │                   │                │              │
  │─────────────────────▶│◀───────────────────│                   │                │              │
  │  {status: parsed, parsed_data}             │                   │                │              │
  │◀─────────────────────│                    │                   │                │              │
  │                      │                    │                   │                │              │
  │  POST /ats/analyze {resume_id, job_id}     │                   │                │              │
  │─────────────────────▶│ fetch resume + job vectors from Qdrant ────────────────▶│              │
  │                      │ cosine similarity → keyword diff → build prompt          │              │
  │                      │────────────────────────────────────────────────────────────────────────▶│
  │                      │◀───────────────────────────────────────────────────────────────────────│
  │                      │ save ats_score row  │                   │                │              │
  │  {score, missing_keywords, suggestions}    │                   │                │              │
  │◀─────────────────────│                    │                   │                │              │
```

**Why upload returns immediately:** the client gets `{id, status: "uploaded"}`
in milliseconds and either polls `GET /resumes/{id}` or (later) receives a
WebSocket/SSE push when `status` flips to `ready`. This is the reason arq
exists in this stack — without it, a resume upload request would block for
however long PDF parsing + embedding generation takes (easily 2–5s,
worse under load). Note this pipeline is entirely local/free (PyMuPDF,
`fastembed`) — no OpenAI credit is spent until the user
reaches ATS suggestions, interviews, or chat (§17). As built today (Phase 2),
this still runs synchronously inline — the arq handoff described here is the
planned upgrade path, not yet implemented (§3, §16).

---

## 8. User Journey (end to end)

1. **Sign up** → `POST /auth/register` → account created, redirected to login.
2. **Log in** → `POST /auth/login` → access + refresh token stored (httpOnly
   cookie recommended over localStorage — not readable by injected JS).
3. **Upload resume** → drag-and-drop PDF/DOCX → immediate "Uploaded, parsing…"
   state → frontend polls `GET /resumes/{id}` until `status: ready` → shows
   parsed skills/education/experience.
4. **Add a job description** (paste text or URL) → `POST /jobs` → keyword
   extraction + embedding runs async.
5. **Run ATS analysis** → select resume + job → `POST /ats/analyze` → score,
   missing keywords, and AI suggestions rendered together. (Formatting-issue
   analysis was in the original plan but isn't built — no logic exists to
   populate it, §3.)
6. **Improve resume** based on suggestions → re-upload as a new resume row →
   re-run ATS to see score delta. (`/resumes/{id}/reparse` re-runs
   extraction on the same file; resume *versioning* as a concept isn't built.)
7. *(Phase 5, not yet built)* **Generate interview questions** → pick difficulty → `POST
   /interviews/generate` (one LLM call, capped at 5 questions) → practice
   screen shows one question at a time, chat-bubble style → user answers →
   `POST /interviews/{id}/answer` stores it with **no feedback shown yet**
   (deliberate — see §17) → after the last question, `POST
   /interviews/{id}/evaluate` (one LLM call for the whole session) → overall
   score + per-question feedback shown together, like a debrief.
8. *(Phase 5, not yet built)* **Chat with the AI career assistant** → open a chat session anchored to a
   resume → ask broad career questions — *"what roles fit my skills?"*,
   *"how do I explain this gap?"*, *"should I learn X or Y next?"* — not just
   resume line-edits. Each call sends a compact resume summary (not the full
   raw text) plus the last ~8 messages as context, so answers stay
   personalized without every message growing more expensive than the last.
9. **(Phase 6) Notifications** — weekly email: "3 new jobs match your latest
   resume", "your ATS score dropped since you added this JD".
10. Throughout 5/7/8, `usage_tracker` (§17) is silently logging estimated
    spend against the $5 demo budget; if it's ever close to exhausted the
    user sees a plain "demo budget reached" message instead of a broken call.

---

## 9. Auth & Security Design

- **Passwords:** bcrypt via `passlib`, never store or log plaintext.
- **Tokens:** JWT access token (15 min TTL, contains `sub=user_id`, `role`),
  opaque refresh token stored **hashed** in `refresh_tokens` table (7–30 day
  TTL). Refresh rotates on every use (old one revoked) — limits the damage
  window if a refresh token leaks.
- **Transport:** refresh token in an `httpOnly`, `Secure`, `SameSite=Lax`
  cookie; access token can be short-lived in memory on the frontend.
- **RBAC:** `role` enum on `users` (`user`/`recruiter`/`admin`); a
  `require_role("admin")` FastAPI dependency gates admin-only routes later
  (e.g. analytics dashboard).
- **Rate limiting:** `slowapi` on `/auth/login` (e.g. 5/min/IP) to blunt
  credential stuffing, and on `/resumes` upload to prevent storage abuse.
- **File upload validation:** enforce max size (e.g. 5MB), whitelist
  MIME/extension (`pdf`, `docx` only), and generate a random storage filename
  (never trust the client's `filename` for the on-disk path) — this closes
  the path-traversal / overwrite risk that exists in the current code (it
  writes directly to `UPLOAD_DIR / file.filename`).
- **CORS:** explicit `CORS_ORIGINS` allow-list (frontend origin only), never
  `*` once cookies/credentials are involved.
- **Secrets:** all provider keys (`OPENAI_API_KEY`, etc.), `JWT_SECRET_KEY`,
  `DATABASE_URL` live in `.env` / deployment secret store — never committed
  (already correctly gitignored).

---

## 10. Background Jobs (arq) — planned design, not yet implemented

**Status:** everything below describes the intended shape once arq is
introduced. As of Phase 4, resume parsing and job keyword/embedding both
still run **synchronously inline** in the request (`ResumeService._process`,
`JobService._process`) — no Redis, no arq worker exists in the stack yet.
This table is the target to move toward if/when that stops being fast enough
(§3, §16 Phase 2 note).

| Task | Trigger | Does |
| --- | --- | --- |
| `parse_resume(resume_id)` | on upload | extract text → skill/keyword matcher → save `parsed_data`, set `status=parsed` |
| `embed_resume(resume_id)` | after parse | `fastembed` embedding → upsert to Qdrant (point id = `resume.id`), `status=parsed` |
| `embed_job(job_id)` | on job creation | keyword extraction + local embedding |
| `generate_interview_questions(session_id)` | on interview generate | **one** LLM call, bulk-insert `interview_questions` |
| `evaluate_interview(session_id)` | on evaluate | **one** LLM call scores all answers together |
| `send_weekly_report(user_id)` | scheduled via arq `cron_jobs` (no separate beat process needed) | Phase 6 — email digest |

Once built, all tasks should be idempotent (safe to retry) and update the
row's `status` field so the API layer never needs to know arq exists — it
just reads state. Any task that calls the OpenAI adapter
(`generate_interview_questions`, `evaluate_interview`, plus the already-built
sync-path `ats_service` call) writes one row to `llm_usage_log` on completion
(§17).

---

## 11. Caching Strategy (Redis)

- arq broker + result backend (already required).
- Cache `GET /jobs/{id}` and `GET /resumes/{id}` reads for a short TTL
  (30–60s) — cheap win once ATS analysis re-reads the same resume/job
  repeatedly in a session.
- Rate-limit counters (`slowapi`).
- Do **not** cache `ats_scores` results themselves — those are already
  persisted rows in Postgres; re-reading a stored analysis is already a cheap
  indexed query.

---

## 12. Error Handling & Observability

- `core/exceptions.py` defines an `AppError` hierarchy
  (`NotFoundError`, `UnauthorizedError`, `ValidationError`, `ConflictError`)
  with a status code + machine-readable `code` string each.
- One global exception handler in `api/middleware/error_handler.py` converts
  any `AppError` (and unhandled exceptions) into a consistent JSON shape:
  `{"error": {"code": "...", "message": "..."}}` — frontend never has to
  branch on error shape per-endpoint.
- `structlog` attaches a `request_id` (generated per request) to every log
  line so a single request's logs can be grepped end-to-end across services.
- Sentry captures unhandled exceptions with the same `request_id` for
  cross-referencing.

---

## 13. Testing Strategy

- `pytest` + `httpx.ASGITransport` against the FastAPI app in-process — no
  live server, fast.
- A test-only Postgres (or SQLite for pure-unit repository tests) via a
  `conftest.py` fixture that creates/drops schema per test session.
- Layer coverage priorities: **services** (business logic) and
  **repositories** (query correctness) get the most unit tests; **endpoints**
  get integration tests for the golden path + auth failure + validation
  failure per route.
- LLM/embedding calls are mocked in tests (never hit real provider APIs in
  CI) — the `LLMProvider` interface (§3) exists specifically so this is a
  one-line swap.

---

## 14. Deployment & CI/CD

```
GitHub Actions (on push/PR)
  → lint (ruff) + type-check + pytest
  → build Docker image
  → (on main) push image, deploy

Production:
  Cloudflare (DNS/CDN)
        │
        ▼
  Frontend → Vercel (Next.js)
  Backend  → container host (FastAPI + arq worker as a separate service; no
             beat process needed — scheduling is built into arq)
        │
        ▼
  Managed Postgres · Managed Redis · Qdrant (self-hosted or Qdrant Cloud)
```

- Frontend and backend deploy independently (Vercel for Next.js is closest to
  the current README's implicit plan; FastAPI needs a real container host,
  not Vercel's serverless functions, because of the arq worker + file
  storage needs).
- `docker-compose.yml` (already in the repo) is your **local dev**
  environment — add `redis` and `qdrant` services to it alongside the
  existing `db`/`backend` (see §15 for the concrete diff).
- File storage: local disk (`uploads/`) is fine for a single-container
  deployment; move to S3-compatible object storage the moment you run more
  than one backend replica (local disk isn't shared across containers).

---

## 15. Migration Path — Current Code → This Architecture

**Status: RESOLVED.** This was the state of the codebase at the very start of
Phase 1, before any of this architecture was built — kept here as a
historical record of what got cleaned up, not a live task list.

What existed at the start (verified by reading the actual files, not just the
old roadmap) and the concrete change made for each:

| Current state | Change needed |
| --- | --- |
| `database/database.py` **and** `database/session.py` both define an engine/`SessionLocal` (one reads `os.getenv` directly, the other reads `core.config.settings`) | Delete `database/database.py`. Keep only `database/session.py`, and have `main.py` import its `engine` from there. |
| `database/base.py` is empty; real `Base` lives in `models/base.py` | Delete `database/base.py` (dead file). |
| `models/user.py` has no `hashed_password`/`role`/timestamps | Add columns per §5 schema; requires an Alembic migration, not a hand edit once real rows exist. |
| `repositories/base_repository.py`, `repositories/resume_repository.py`, `services/auth_service.py`, `utils/file_handler.py` are empty stubs | Implement per §4 structure — these are exactly the files this architecture expects, just not filled in yet. |
| `resumes.py` endpoint saves the file + extracts text but **never writes a `Resume` row** | Wire `ResumeService.upload` through `ResumeRepository` to persist `filename`, `file_path`, `raw_text`, `status`. |
| Upload writes to `UPLOAD_DIR / file.filename` (client-controlled path) | Generate a server-side random filename (e.g. `uuid4().hex + extension`) before writing — current code is path-traversal-adjacent. |
| No Alembic anywhere despite being in `requirements.txt` and the old roadmap | `alembic init alembic`, point `env.py` at `models.base.Base.metadata`, generate an initial migration that matches current tables, replace `Base.metadata.create_all()` in `main.py`'s startup hook. |
| `requirements.txt` is saved as UTF-16 (each char space-separated when read as text) | Re-save as UTF-8 — as-is this will likely fail `pip install -r requirements.txt` in the Docker build. |
| Two upload directories: `uploads/` and `uploades/` (typo) | Delete `uploades/`, keep `uploads/resumes/`. |
| `schemas/resume.schema.py`'s `ResumeResponse` defined but never used as a `response_model` | Wire it into `resumes.py` once the endpoint returns a real `Resume` row. |
| `docker-compose.yml` has only `db` + `backend` | Add `redis` and `qdrant` services once Phase 3 (embeddings) starts; add an `arq_worker` service once background tasks exist. |
| No `core/security.py`, `core/constants.py`, `core/logger.py`, `core/exceptions.py` | Create per §4 — these are referenced throughout this architecture and don't exist yet. |

---

## 16. Phased Build Order

Sequenced so each phase is independently shippable/testable before the next
begins — this is what "complete quickly" means in practice: no phase should
block on infrastructure the next phase hasn't justified yet.

### Phase 1 — Foundation & Auth ✅ built & verified
- Fixed the DB duplication (§15), added Alembic, ran initial migration.
- Added `hashed_password`/`role`/timestamps to `User`, UUID PKs throughout.
- Built `core/security.py` (bcrypt via the raw `bcrypt` library, not `passlib`
  — `passlib` 1.7.4 is unmaintained and broke against current `bcrypt`'s
  stricter 72-byte handling; swapped to calling `bcrypt` directly, same
  `hash_password`/`verify_password` call sites, zero blast radius elsewhere),
  `auth_service.py`, `/auth/register|login|refresh|logout|me`,
  `get_current_user` (via `HTTPBearer`, not `OAuth2PasswordBearer` — the
  latter renders a mismatched OAuth2-password-grant form in Swagger's
  Authorize modal instead of a plain bearer-token field).
- Refresh tokens: random opaque string, hashed (SHA-256) at rest, rotated on
  every use.
- Added `core/exceptions.py` (`AppError` hierarchy) + global error handler,
  plus a `ResponseMiddleware` (not originally planned) that wraps every
  successful JSON response as `{"success", "message", "data"}`.
- Verified end-to-end: register → login → protected routes → refresh
  rotation → logout revocation → duplicate-email conflict → invalid-token
  rejection, all returning clean, consistent JSON.

### Phase 2 — Resume Pipeline ✅ built & verified (still fully synchronous)
- Fixed upload path (server-generated random filename, not client-supplied),
  persists `Resume` rows via `resume_repository.py`.
- `python-docx` added alongside PyMuPDF.
- `parsing_service.py` extracts email/phone via regex + skills via a curated
  word-list matcher (`services/keyword_service.py`) — **not spaCy yet** (§3).
- Empty-extraction guard: if a PDF/DOCX yields no text (e.g. a scanned
  image), the resume is marked `status: failed` instead of silently
  "succeeding" with empty data.
- arq/Redis **not introduced** — processing has stayed fast enough
  synchronously that the doc's own trigger condition ("once it's slow") has
  never fired. Revisit if this changes.

### Phase 3 — Embeddings & Semantic Search ✅ built & verified
- Qdrant added to `docker-compose.yml`, two collections (`resumes`, `jobs`).
- `embedding_service.py` using `fastembed` (swapped from the originally
  planned `sentence-transformers` — §3), local model cache persisted via
  bind mount.
- `jobs.py` endpoints (create/list/get/delete) + keyword extraction reusing
  the same curated skill-list matcher as resumes.
- Verified with a real semantic-search test: a matching job scored `0.793`
  cosine similarity against a test resume, an unrelated job scored `0.433` —
  confirmed the embeddings are semantically meaningful, not just present.

### Phase 4 — ATS Engine ✅ built & verified
- `ats_service.py`: blended score = `0.6 × cosine_similarity + 0.4 ×
  keyword_coverage` (falls back to pure similarity if a job has zero
  extracted keywords, rather than fabricating 100% coverage — an early bug
  where the empty-keywords fallback defaulted to `1.0` and silently inflated
  scores was caught and fixed via this exact test case).
- `LLMProvider` interface + the OpenAI adapter only (`gpt-4o-mini`) — no
  Gemini/Anthropic adapters, per §17.
- `usage_tracker.py` + `llm_usage_log` wired in at this first real spend
  point: `ensure_budget_available` runs before every OpenAI call.
- `/ats/analyze|{id}|resume/{resume_id}` endpoints, ownership-checked through
  both the resume and the job.

### Phase 5 — Interviews & Chat — next up
- `interview_service.py` + `/interviews/*` — question generation and evaluation each as a single batched LLM call (§17), never per-question.
- `chat_service.py` + `/chat/*`, resume-context-aware system prompt built from a compact resume summary + trimmed message history, not raw resume text or full history.
- `usage_tracker` guard applied to both.

### Phase 6 — Hardening & Ops
- `structlog` + Sentry.
- `slowapi` rate limiting on auth + upload.
- CI (GitHub Actions: lint, type-check, pytest) before any deploy step.
- Weekly report email task (arq cron).
- Move uploads to S3-compatible storage if scaling beyond one backend replica.

---

## 17. Cost Governance — Operating Within a Fixed $5 Budget

This is a **portfolio/demo project**, not a funded product: the OpenAI key
behind it has a fixed, non-renewing **$5 credit**, meant to survive being
demoed repeatedly (e.g. in interviews). Every design decision that touches an
LLM in this document was made with that constraint in mind, not added as an
afterthought — collected here in one place:

| Decision | Cost impact |
| --- | --- |
| Embeddings run locally via `fastembed`, not OpenAI | Resume/job embedding — potentially the highest-*volume* call in the app — costs **$0**, leaving the entire credit for chat + interview generation/evaluation. |
| Model default is `gpt-4o-mini` everywhere | The cheapest OpenAI chat-capable model; a few cents covers dozens of interview sessions and chat conversations. |
| Interview questions generated in **one** call, evaluated in **one** call | Bounds an interview session to exactly 2 LLM calls regardless of question count — 5 questions costs the same as 10. Per-answer feedback would have made cost scale with question count instead. |
| Chat sends a compact resume summary + last ~8 messages, not full resume text + full history | Keeps every chat turn a small, flat-cost request instead of one that grows more expensive as a conversation gets longer. |
| ATS/interview results are persisted rows, re-read is a DB query | Viewing a result again (e.g. refreshing the page, going back to review a past score) never re-triggers an LLM call — only generating a *new* analysis does. |
| Only one paid provider (OpenAI) is built, no Gemini/Anthropic adapters yet | One bill to watch, not three; the `LLMProvider` interface keeps the door open without the added surface area now. |

**`usage_tracker` service (`services/usage_tracker.py`) + `llm_usage_log` table (§5):**

- Every call through `llm/openai_provider.py` returns token usage (OpenAI's
  response includes `usage.prompt_tokens` / `usage.completion_tokens`); the
  provider wrapper writes one `llm_usage_log` row per call with an estimated
  cost (`tokens × current per-model rate`, rate kept in `core/constants.py`
  so it's a one-line update if OpenAI repricing happens).
- `core/config.py` gets a `MAX_LLM_SPEND_USD` setting (default something
  comfortably under $5, e.g. `4.50`, to leave headroom for pricing drift).
  Before making a call, the calling service sums `llm_usage_log` and, if the
  ceiling would be breached, returns a plain, friendly response — *"Demo
  budget reached — this feature is temporarily paused"* — instead of letting
  the request hit OpenAI and fail with a billing error mid-demo.
- This is intentionally simple (a summed column, not a full metering
  system) — proportionate to a $5 budget, not a production billing pipeline.
  It's also a legitimate thing to point to in an interview: cost-awareness
  designed in, not discovered after the key ran out.

**Rough order-of-magnitude cost** (subject to current OpenAI pricing, verify
before relying on it): with `gpt-4o-mini`, a full interview session
(generate + evaluate, ~5 questions) and a multi-turn chat conversation each
cost a small fraction of a cent to a few cents — the $5 credit is not a tight
constraint for *normal* demo usage; the real purpose of `usage_tracker` is a
safety net against bugs (e.g. an accidental retry loop) burning the credit
unattended, not rationing a handful of interview demos.

---

## 18. Frontend Architecture (target)

```text
frontend/
├── app/                     # Next.js App Router pages
├── components/              # shared UI (shadcn/ui-based)
├── services/                 # typed API client functions (one file per backend resource)
├── hooks/                    # TanStack Query hooks wrapping services/
├── store/                    # Zustand stores (auth/session, UI state)
├── schemas/                  # zod schemas mirroring backend Pydantic schemas
├── lib/                      # api client instance (axios w/ interceptor for token refresh)
├── constants/
├── types/
└── middleware.ts             # route protection (redirect if no session)
```

- **Token refresh flow:** axios response interceptor catches `401`, calls
  `/auth/refresh` once, retries the original request — the rest of the app
  never handles token expiry manually.
- **Server state vs client state split:** anything that came from the API
  (resumes, jobs, ats scores) lives in TanStack Query's cache, not Zustand —
  Zustand only holds things with no server source of truth (current user
  object post-login, modal open/closed, wizard step).

---

## 19. Deployment — Free Hosting Options

Two viable paths, both $0, chosen for different reasons. `docker-compose.yml`
stays the **local dev** file either way — production always uses one of
these targets, never "run compose on my laptop and expose it."

### Option A — Self-host on one VPS (recommended starting point)

Run the whole stack (Postgres, Redis, Qdrant, FastAPI, arq worker) as
containers on a single rented machine, using the same `docker-compose.yml`
you already have, plus `redis`/`qdrant`/`arq_worker` services added per §15.

**Best free VPS: Oracle Cloud "Always Free" tier** — an ARM VM
(`VM.Standard.A1.Flex`, up to 4 OCPU / 24GB RAM) that is free **forever**,
not a trial credit. Paid fallback if that doesn't pan out: Hetzner Cloud
(~$4–5/month, no capacity issues, closest thing to guaranteed availability).

**Steps:**
1. Create the VPS (§20 below has the Oracle-specific walkthrough).
2. SSH in, install Docker + Docker Compose.
3. Clone the repo, create a production `.env` (`DATABASE_URL`,
   `JWT_SECRET_KEY`, `OPENAI_API_KEY`, `MAX_LLM_SPEND_USD`, …).
4. Add `redis`, `qdrant`, `arq_worker` services to `docker-compose.yml`.
5. `docker compose up -d --build`.
6. Put **Nginx** in front as a reverse proxy (`/api` → backend container,
   `/` → frontend container or static export) + **Certbot** for free
   Let's Encrypt HTTPS.
7. `ufw` firewall: only `22`, `80`, `443` open.
8. `restart: unless-stopped` on every service in compose, so a reboot
   recovers the whole stack automatically.
9. A cron job running `pg_dump` to free object storage (e.g. Backblaze B2)
   — the VPS is a single point of failure, so back up the one thing that
   can't be rebuilt from scratch (the database).

**Why this first:** it matches the docker-compose setup you already built —
no architecture rework, just filling in the services already planned in
§15/§16. It also doubles as a legitimate DevOps talking point in an
interview (containerization, reverse proxy, TLS, firewalling — done by you,
not a platform).

### Option B — Managed free-tier hybrid (fallback / lower-maintenance)

| Component | Service |
| --- | --- |
| Frontend | **Vercel** (Hobby, free) |
| Backend + arq worker | **Fly.io** (free allowance, ~3 small VMs) |
| PostgreSQL | **Neon.tech** (serverless, free forever) |
| Redis | **Upstash** (serverless, free tier) |
| Qdrant | **Qdrant Cloud** (1GB free cluster forever) |

No server to patch, no manual TLS renewal, no backup script to remember —
each provider handles its own piece. Trade-off: free-tier compute sleeps
when idle, so the first request after inactivity can take 30–50s (fine for
a demo, just "wake it up" before showing it live). Use this if the Oracle
VPS route stalls on sign-up/capacity (§20) and you want something running
today instead of debugging VM availability.

### Recommendation

Start with **Option A (Oracle VPS)** since it reuses your existing
`docker-compose.yml` directly and costs literally nothing if the sign-up
succeeds. Keep **Option B** as the fallback you switch to without losing any
time if Oracle capacity doesn't cooperate (§20) — it's a same-day path to a
live URL either way.

---

## 20. Oracle Cloud Free Tier — Sign-up Walkthrough & the Capacity Problem

Oracle's Always-Free ARM shape is genuinely free forever, but it has one
well-known friction point: the free ARM capacity is heavily contended, so
"Out of host capacity" on instance creation is common. This section is
honest about that — there's no way to *guarantee* success, only to reduce
how long it takes.

**Sign-up steps:**
1. Go to Oracle's cloud free-tier sign-up page, register with an email.
2. A valid debit/credit card is required for identity verification — you
   are not charged for Always Free resources, but the account can't be
   created without one.
3. **Pick your Home Region carefully at sign-up — this cannot be changed
   later** without creating an entirely new account. This single choice is
   the biggest lever on whether you'll find free ARM capacity, since some
   regions are far more contended than others (US East/West are typically
   the most competed-over; smaller regions tend to have better odds, but
   *which* region is best shifts over time — check recent community reports,
   e.g. r/oraclecloud, right before you sign up rather than trusting a fixed
   recommendation here).
4. After the account exists: Console → **Compute → Instances → Create
   Instance** → choose the **Always Free eligible** shape
   (`VM.Standard.A1.Flex`).

**If you hit "Out of host capacity":**
- Try a smaller shape first — e.g. 1 OCPU / 6GB instead of the full
  4 OCPU / 24GB. Partial allocations succeed more often than the maximum.
- Try every Availability Domain in your region, not just the default one.
- Try at different times of day — capacity opens up sporadically (often
  late night/early morning in that region's local time).
- The community maintains open-source retry scripts that call Oracle's own
  instance-creation API on your account every few minutes until it
  succeeds — this is just automated polling of an API you already have
  credentials for, not something that touches any other system, so it's a
  reasonable time-saver over manually retrying by hand. It still isn't a
  guarantee; it just removes the tedium of clicking retry yourself.
- If ARM capacity never frees up: fall back to the other Always-Free shape,
  `VM.Standard.E2.1.Micro` (AMD, 1GB RAM each, up to 2 instances) — far less
  contended so easier to get, but 1GB is tight for Postgres + Redis + Qdrant
  + FastAPI + worker together; you'd likely need to split services across
  both free Micro instances or drop Qdrant to Qdrant Cloud instead of
  self-hosting it.
- If none of the above works in a reasonable time: switch to **Option B**
  (§19) or a cheap guaranteed VPS (Hetzner) rather than losing more time —
  the architecture doesn't change either way, only where it's hosted.

**Bottom line:** this reduces the odds and the wait, it doesn't eliminate
the possibility of hitting capacity limits — that part is genuinely outside
your control and Oracle's, on their end, not yours.
