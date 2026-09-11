# RamHub

**A platform for Fordham's international students** — the courses to register for, the paperwork to file (and when), and who to actually contact, plus your own Trello-style boards and calendar to stay on top of it — instead of scattered advisor emails, PDFs, and group chats.

## Problem

Fordham has no centralized source of practical onboarding knowledge for international students. Course registration tips, CPT/OPT and visa-related paperwork deadlines, and "which office handles this" all live in people's heads and get re-asked, one-on-one, every semester — most urgently during registration and OPT/CPT filing windows, when getting it wrong has real consequences (registration holds, visa status issues, delayed graduation). RamHub exists so that knowledge is written down once and stays discoverable for the next cohort, instead of evaporating when each class graduates — and gives students a place to actually track their own tasks and deadlines against it.

## What it does (v1)

**Public resources** (no account needed)
- **Courses** — program-specific course info with registration tips from students who've taken them
- **Paperwork** — CPT/OPT, health insurance waiver, immunization records, etc., each with deadlines and the right contact
- **Contacts** — a directory mapping "I need to do X" to the actual office/person, instead of guessing
- **Search** — one search bar across all of the above

**Your account** (sign up free)
- **Boards** — Trello-style boards with drag-and-drop cards across customizable lists, for tracking your own semester tasks
- **Calendar** — a month view combining events you add yourself with due dates pulled automatically from your board cards

## Architecture

```
ramhub/
├── backend/    FastAPI + SQLAlchemy + PostgreSQL, migrations via Alembic
└── frontend/   Next.js (App Router) + TypeScript + Tailwind
```

**Backend** is organized as domain packages (`app/domains/{auth,courses,paperwork,contacts,submissions,boards,calendar,search}`), each owning its own models, Pydantic schemas, and router — no shared flat `models.py`/`routers.py` grab-bag. Auth is email/password with bcrypt + JWT (`app/security.py`, `app/deps.py`); every board/calendar endpoint checks resource ownership before returning or mutating data.

**Frontend** splits public marketing/resource pages (`src/app/(marketing)/`) from the authenticated app shell (`src/app/app/`, guarded by `middleware.ts` + Auth.js). Feature logic (the Kanban board, the landing page sections) lives under `src/features/`, not inlined in route files. Auth.js (NextAuth v5) handles sessions in Next.js and forwards a backend-issued JWT with every API call, so FastAPI stays the single source of truth for auth rather than trusting Next.js's session directly.

Key libraries: **dnd-kit** (drag-and-drop board), **TanStack Query** (data fetching/caching against the FastAPI backend), **FullCalendar** (calendar view), **shadcn/ui** + **Motion** (component system and landing-page animation), **Geist** + **Space Grotesk** (type).

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

Visit `http://localhost:3000`. The frontend expects the API at `http://localhost:8000` and needs an `AUTH_SECRET` for Auth.js — see `frontend/.env.local` (generate one with `openssl rand -base64 32`).

## Roadmap

- Google Calendar sync (real two-way sync once a Google Cloud OAuth app is set up — the in-app calendar is built to the point where this is an additive integration, not a rework)
- Moderated review flow for student-submitted corrections
- Full-text/embedding search over official OISS documents (I-20 guides, handbooks) for direct Q&A instead of just browsing
- Per-semester deadline tracking (auto-rolling dates rather than hardcoded ones)
