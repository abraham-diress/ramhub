"""Seed the database with starter content. Run with: uv run python -m app.seed"""

from datetime import date

from app.database import Base, SessionLocal, engine
from app import domains  # noqa: F401  (registers models on Base.metadata)
from app.domains.contacts.models import Contact
from app.domains.courses.models import Course
from app.domains.paperwork.models import PaperworkItem

COURSES = [
    dict(
        code="DSCI 6612",
        title="Machine Learning",
        program="MS Data Science",
        credits=3,
        recommended_term="1st semester",
        description="Core ML course covering supervised/unsupervised learning, model evaluation.",
        tips="Heavy on math prerequisites — brush up on linear algebra before the semester starts.",
    ),
    dict(
        code="DSCI 6620",
        title="Data Mining",
        program="MS Data Science",
        credits=3,
        recommended_term="1st or 2nd semester",
        description="Pattern discovery, clustering, association rules on large datasets.",
        tips="Group-project heavy — pick teammates early.",
    ),
    dict(
        code="CISC 5350",
        title="Practical Machine Learning",
        program="MS Computer Science",
        credits=3,
        recommended_term="1st semester",
        description="Applied ML with an emphasis on implementation over theory.",
        tips=None,
    ),
]

PAPERWORK = [
    dict(
        title="Submit CPT Application",
        description="Curricular Practical Training authorization needed before starting any internship, paid or unpaid.",
        applies_to="F-1 students seeking internships",
        deadline_date=None,
        deadline_note="Submit at least 3-4 weeks before your internship start date",
        external_link="https://www.fordham.edu/global-services/current-students/cpt/",
    ),
    dict(
        title="Apply for OPT",
        description="Optional Practical Training authorization for post-graduation employment.",
        applies_to="F-1 students graduating soon",
        deadline_date=None,
        deadline_note="USCIS allows filing up to 90 days before and 60 days after your program end date — but file as early as possible",
        external_link="https://www.fordham.edu/global-services/current-students/opt/",
    ),
    dict(
        title="Health Insurance Waiver / Enrollment",
        description="All students are auto-enrolled in Fordham's health plan unless a waiver with comparable coverage is submitted.",
        applies_to="All students",
        deadline_date=date(2026, 9, 15),
        deadline_note="Falls near the start of each semester — check the exact date on the Student Health portal",
        external_link=None,
    ),
    dict(
        title="Immunization Records Submission",
        description="NY State requires proof of MMR and Meningitis vaccination before you can register for a second semester.",
        applies_to="All incoming students",
        deadline_date=None,
        deadline_note="Submit before orientation to avoid a registration hold",
        external_link=None,
    ),
]

CONTACTS = [
    dict(
        name="Office of International Services (OISS)",
        role="International student advising",
        office="OISS",
        email="oiss@fordham.edu",
        phone=None,
        reach_out_for="CPT/OPT authorization, I-20 issues, visa status questions, travel signatures",
    ),
    dict(
        name="MS Data Science Program Office",
        role="Academic advising",
        office="Gabelli/GSAS Data Science Program",
        email=None,
        phone=None,
        reach_out_for="Course registration holds, program requirements, transfer credit questions",
    ),
    dict(
        name="Student Health Center",
        role="Health services & insurance",
        office="Student Health Services",
        email=None,
        phone=None,
        reach_out_for="Health insurance waiver, immunization record submission",
    ),
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Course).count() == 0:
            db.add_all(Course(**c) for c in COURSES)
        contacts_by_office = {c.office: c for c in db.query(Contact).all()}
        if not contacts_by_office:
            new_contacts = [Contact(**c) for c in CONTACTS]
            db.add_all(new_contacts)
            db.flush()
            contacts_by_office = {c.office: c for c in new_contacts}

        if db.query(PaperworkItem).count() == 0:
            oiss = contacts_by_office.get("OISS")
            health = contacts_by_office.get("Student Health Services")
            contact_map = {
                "Submit CPT Application": oiss,
                "Apply for OPT": oiss,
                "Health Insurance Waiver / Enrollment": health,
                "Immunization Records Submission": health,
            }
            for item in PAPERWORK:
                contact = contact_map.get(item["title"])
                db.add(PaperworkItem(**item, contact_id=contact.id if contact else None))

        db.commit()
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
