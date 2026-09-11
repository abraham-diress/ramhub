from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import contacts, courses, paperwork, search, submissions

app = FastAPI(title="RamHub API", description="International student onboarding hub for Fordham")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(courses.router)
app.include_router(paperwork.router)
app.include_router(contacts.router)
app.include_router(submissions.router)
app.include_router(search.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
