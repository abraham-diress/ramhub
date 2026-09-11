from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.domains.auth.router import router as auth_router
from app.domains.boards.router import router as boards_router
from app.domains.calendar.router import router as calendar_router
from app.domains.contacts.router import router as contacts_router
from app.domains.courses.router import router as courses_router
from app.domains.paperwork.router import router as paperwork_router
from app.domains.search.router import router as search_router
from app.domains.submissions.router import router as submissions_router

app = FastAPI(title="RamHub API", description="Fordham international student platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(courses_router)
app.include_router(paperwork_router)
app.include_router(contacts_router)
app.include_router(submissions_router)
app.include_router(search_router)
app.include_router(boards_router)
app.include_router(calendar_router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
