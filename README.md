# RamHub

**A knowledge hub for Fordham's international students** — the courses to register for, the paperwork to file (and when), and who to actually contact — in one place instead of scattered across advisor emails, PDFs, and group chats.

## Problem

Fordham has no centralized source of practical onboarding knowledge for international students. Course registration tips, CPT/OPT and visa-related paperwork deadlines, and "which office handles this" all live in people's heads and get re-asked, one-on-one, every semester — most urgently during registration and OPT/CPT filing windows, when getting it wrong has real consequences (registration holds, visa status issues, delayed graduation). RamHub exists so that knowledge is written down once and stays discoverable for the next cohort, instead of evaporating when each class graduates.

## What it does (v1)

- **Courses** — program-specific course info with registration tips from students who've taken them
- **Paperwork** — CPT/OPT, health insurance waiver, immunization records, etc., each with deadlines and the right contact
- **Contacts** — a directory mapping "I need to do X" to the actual office/person, instead of guessing
- **Search** — one search bar across all of the above

## Architecture

```
ramhub/
├── backend/    FastAPI + SQLAlchemy + PostgreSQL, migrations via Alembic
└── frontend/   Next.js (App Router) + TypeScript + Tailwind
```

The backend exposes a small REST API (`/api/courses`, `/api/paperwork`, `/api/contacts`, `/api/search`, `/api/submissions`); the frontend renders it server-side via React Server Components. `/api/submissions` accepts student-submitted corrections/additions for moderator review, so the content doesn't go stale after the people who wrote it graduate.

## Running locally

**Backend**

```bash
cd backend
docker compose -f ../docker-compose.yml up -d   # starts Postgres
cp .env.example .env
uv sync
uv run alembic upgrade head
uv run python -m app.seed     # loads starter content
uv run uvicorn app.main:app --reload --port 8000
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` (frontend expects the API at `http://localhost:8000` — see `frontend/.env.local`).

## Roadmap

- Moderated review flow for student-submitted corrections
- Full-text/embedding search over official OISS documents (I-20 guides, handbooks) for direct Q&A instead of just browsing
- Per-semester deadline tracking (auto-rolling dates rather than hardcoded ones)
