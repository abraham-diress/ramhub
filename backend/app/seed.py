"""Seed the database with researched starter content. Run with: uv run python -m app.seed

Every paperwork item carries the source it was taken from and the date it was last
checked, because immigration and billing rules change and stale advice here is worse
than no advice. Re-running this refreshes existing rows by their natural key.
"""

from datetime import date

from app.database import Base, SessionLocal, engine
from app import domains  # noqa: F401  (registers models on Base.metadata)
from app.domains.contacts.models import Contact
from app.domains.courses.models import Course
from app.domains.paperwork.models import PaperworkItem

VERIFIED = date(2026, 9, 18)

PRE_ARRIVAL_GUIDE = (
    "https://www.fordham.edu/media/home/departments-centers-and-offices/international-services"
    "/International-Student-Pre-Arrival-Guide-updated-4.28.2026.pdf"
)
OIS_SITE = "https://www.fordham.edu/ois"
CPT_PAGE = (
    "https://www.fordham.edu/academics/academic-resources/international-services/students"
    "/current-students/f-1-students/working-legally-in-the-us/curricular-practical-training/"
)
CPT_FORM = (
    "https://www.fordham.edu/media/home/departments-centers-and-offices/international-services"
    "/pdfs/CPT-Form.pdf"
)
USCIS_OPT = (
    "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors"
    "/optional-practical-training-opt-for-f-1-students"
)
DS_BULLETIN = "https://bulletin.fordham.edu/gsas/computer-information-sciences/data-science-ms/"

CONTACTS = [
    dict(
        name="Office for International Services (OIS)",
        role="Immigration advising for F-1 and J-1 students",
        office="OIS",
        category="immigration",
        email="ois@fordham.edu",
        phone=None,
        website=OIS_SITE,
        rose_hill_location="441 E. Fordham Rd., Walsh Library 049, Bronx, NY 10458",
        lincoln_center_location="Martino Hall, 45 Columbus Ave, Suite 315, New York, NY 10023",
        reach_out_for=(
            "Immigration check-in, CPT and OPT authorization, I-20 corrections and reprints, "
            "travel signatures, bank letters, reporting scam calls. New students: oisnewstudent@fordham.edu. "
            "Open Monday to Friday, 9 a.m. to 5 p.m.; appointments in person, by phone, or on Zoom."
        ),
    ),
    dict(
        name="University Health Services",
        role="Health care, insurance waivers, immunization records",
        office="Health Services",
        category="health",
        email="health@fordham.edu",
        phone="Rose Hill 718-817-4160 | Lincoln Center 212-636-7160",
        website="https://www.fordham.edu/health",
        rose_hill_location="O'Hare Hall, Basement",
        lincoln_center_location="McMahon Hall, 2nd Floor, Room 203",
        reach_out_for="Health insurance waiver, immunization forms and holds, campus medical care",
    ),
    dict(
        name="Counseling and Psychological Services",
        role="Mental health support",
        office="Counseling and Psychological Services",
        category="health",
        email="jeng@fordham.edu",
        phone="Rose Hill 718-817-3725 | Lincoln Center 212-636-6225",
        website=(
            "https://www.fordham.edu/student-life/safety-health-and-wellness"
            "/counseling-and-psychological-services/"
        ),
        rose_hill_location="O'Hare Hall, Basement",
        lincoln_center_location="140 West 62nd St, Room G-02",
        reach_out_for="Counseling appointments, homesickness, stress and adjustment support",
    ),
    dict(
        name="Department of Public Safety",
        role="Campus safety and emergencies",
        office="Public Safety",
        category="safety",
        email=None,
        phone="Rose Hill 718-817-2222 | Lincoln Center 212-636-6075",
        website="https://www.fordham.edu/public_safety",
        rose_hill_location="Thebaud Hall Annex",
        lincoln_center_location="McMahon Hall Lobby",
        reach_out_for="Emergencies on campus, escorts, lost property, safety concerns",
    ),
    dict(
        name="Office of Student Accounts",
        role="Tuition bills and payments",
        office="Student Accounts",
        category="money",
        email="studentaccts@fordham.edu",
        phone="Rose Hill 718-817-4900 | Lincoln Center 212-636-6700",
        website=(
            "https://www.fordham.edu/about/leadership-and-administration/administrative-offices"
            "/office-of-student-accounts/"
        ),
        rose_hill_location="Thebaud Hall",
        lincoln_center_location="Lowenstein Building, Rm. 214",
        reach_out_for="Tuition bills, international wire transfers, payment plans, refunds",
    ),
    dict(
        name="Academic Records (Registrar)",
        role="Registration and transcripts",
        office="Academic Records",
        category="academics",
        email="acadrecords@fordham.edu",
        phone="718-817-3900",
        website=(
            "https://www.fordham.edu/about/leadership-and-administration/administrative-offices"
            "/enrollment-group/academic-records/"
        ),
        rose_hill_location=None,
        lincoln_center_location=None,
        reach_out_for="Registration holds, enrollment verification, transcripts, adding or dropping courses",
    ),
    dict(
        name="Graduate School of Arts and Sciences",
        role="Graduate academic advising",
        office="GSAS",
        category="academics",
        email="fuga@fordham.edu",
        phone="718-817-4419",
        website="https://www.fordham.edu/gsas",
        rose_hill_location=None,
        lincoln_center_location=None,
        reach_out_for="Degree requirements, advisor assignment, CPT academic approval for GSAS programs",
    ),
    dict(
        name="Office of Residential Life",
        role="On-campus housing",
        office="Residential Life",
        category="housing",
        email="reslifelc@fordham.edu (LC) | resliferh@fordham.edu (RH)",
        phone="Rose Hill 718-817-3080 | Lincoln Center 212-636-7100",
        website="https://www.fordham.edu/student-life/living-on-campus/",
        rose_hill_location="Loschert Hall, Basement",
        lincoln_center_location="McMahon Hall, Rm. 108",
        reach_out_for=(
            "Housing waitlist, move-in dates, staying on campus over winter and spring break. "
            "Rose Hill residence halls are undergraduate only."
        ),
    ),
    dict(
        name="IT Service Desk",
        role="Accounts, Wi-Fi, and software",
        office="Information Technology",
        category="campus",
        email="helpdesk@fordham.edu",
        phone="718-817-3999",
        website="https://www.fordham.edu/it",
        rose_hill_location="McShane Center 266",
        lincoln_center_location="Leon Lowenstein SL18",
        reach_out_for="Fordham account setup, password resets, Wi-Fi, My Apps portal problems",
    ),
    dict(
        name="Institute of American Language and Culture (IALC)",
        role="English language programs",
        office="IALC",
        category="academics",
        email="esl@fordham.edu",
        phone="212-636-6353",
        website="https://www.fordham.edu/esl",
        rose_hill_location=None,
        lincoln_center_location="33 W 60th St, 3rd Floor",
        reach_out_for="Intensive English program, language support, IALC full-time enrollment rules",
    ),
]

PAPERWORK = [
    # ---------- Before you arrive ----------
    dict(
        title="Check and sign your I-20 or DS-2019",
        description=(
            "Your I-20 is the document your whole visa status rests on. Check that your name, date of "
            "birth, and program details are correct, then print it and sign it in ink on the first page. "
            "Digital signatures are not accepted. If the major on page 1 does not exactly match your "
            "admission letter, that is normal, it comes from a government CIP code. Use the major from "
            "your admission letter when you fill in the DS-160."
        ),
        applies_to="All incoming F-1 and J-1 students",
        phase="before_arrival",
        position=0,
        is_critical=True,
        deadline_note="Before your visa interview, and bring the printed copy when you travel",
        steps=[
            "Check every biographical detail against your passport",
            "Email oisnewstudent@fordham.edu if anything needs correcting",
            "Print all pages and staple them together",
            "Sign and date in ink at the X on page 1",
        ],
        external_link=None,
        source_name="Fordham OIS International Student Pre-Arrival Guide",
        source_url=PRE_ARRIVAL_GUIDE,
    ),
    dict(
        title="Pay the I-901 SEVIS fee",
        description=(
            "A federal fee tied to your SEVIS ID, separate from the visa application fee. You must pay it "
            "for each new initial I-20 or DS-2019. Save the receipt, you need it at your visa interview and "
            "at the port of entry."
        ),
        applies_to="F-1 and J-1 students with a new initial I-20 or DS-2019",
        phase="before_arrival",
        position=1,
        is_critical=True,
        deadline_note="At least 3 days before your visa interview",
        steps=[
            "Pay only at FMJfee.com, the one site authorized to collect this fee",
            "Save and print the payment receipt",
            "Skip this only if you have a transfer-pending I-20 and resume classes within 5 months",
        ],
        external_link="https://www.fmjfee.com/",
        source_name="Fordham OIS International Student Pre-Arrival Guide",
        source_url=PRE_ARRIVAL_GUIDE,
    ),
    dict(
        title="Apply for your F-1 or J-1 visa",
        description=(
            "You can apply up to 12 months before the start date on your I-20. Interview wait times vary a "
            "lot by consulate, so book as early as you can. Canadian and Bermudian citizens are visa-exempt "
            "but still need an I-20 and a paid SEVIS fee."
        ),
        applies_to="All incoming international students outside the US",
        phase="before_arrival",
        position=2,
        is_critical=True,
        deadline_note="Apply as early as possible, up to 12 months before your I-20 start date",
        steps=[
            "Complete the DS-160 and print the confirmation page",
            "Pay the MRV visa application fee for your consulate",
            "Book biometrics and the interview using your DS-160 ID, MRV receipt, passport, and SEVIS ID",
            "Bring: DS-160 confirmation, MRV receipt, printed I-20, SEVIS receipt, photo, passport",
            "If you have no US contact for the DS-160, you may list the OIS campus address",
        ],
        external_link="https://travel.state.gov/",
        source_name="Fordham OIS International Student Pre-Arrival Guide",
        source_url=PRE_ARRIVAL_GUIDE,
    ),
    dict(
        title="Book travel inside your entry window",
        description=(
            "F-1 and J-1 rules let you enter the US no more than 30 days before the start date on your "
            "I-20. Arriving earlier than that is not allowed, so check the earliest admission date printed "
            "on page 1 before you book flights."
        ),
        applies_to="All incoming international students",
        phase="before_arrival",
        position=3,
        is_critical=True,
        deadline_note="No earlier than 30 days before your I-20 start date",
        steps=[
            "Find the earliest admission date on page 1 of your I-20",
            "Keep passport, visa, I-20, and admission letter in your carry-on, never checked luggage",
            "Make sure your passport is valid at least 6 months beyond your entry date",
            "Check the stamp says F-1 or J-1 before you leave the immigration desk",
        ],
        external_link=None,
        source_name="Fordham OIS International Student Pre-Arrival Guide",
        source_url=PRE_ARRIVAL_GUIDE,
    ),
    dict(
        title="Get your immunization records translated",
        description=(
            "New York State law requires proof of immunity to measles, mumps, and rubella. Bring official "
            "documentation with vaccine names and dates, in English or with a translation. Sorting this out "
            "at home is far cheaper and easier than doing it in New York."
        ),
        applies_to="All incoming students",
        phase="before_arrival",
        position=4,
        is_critical=False,
        deadline_note="Bring with you, required at academic registration",
        steps=[
            "Get official MMR documentation with dates from your doctor",
            "Have it translated into English if needed",
            "Also consider a physical, dental, and vision exam before you leave, US care is expensive",
        ],
        external_link=None,
        source_name="Fordham OIS International Student Pre-Arrival Guide",
        source_url=PRE_ARRIVAL_GUIDE,
    ),
    dict(
        title="Plan your budget and first-month cash",
        description=(
            "OIS advises that living in New York City for under about $2,000 a month is extremely "
            "difficult. Bank transfers from abroad are often delayed, and the university expects the first "
            "semester's tuition to be paid before classes start, so plan the timing, not just the amount."
        ),
        applies_to="All incoming international students",
        phase="before_arrival",
        position=5,
        is_critical=False,
        deadline_note="Tuition due during the registration period, before classes begin",
        steps=[
            "Carry about $200 in small bills for taxis and first meals",
            "Have $1,000 to $2,000 reachable by ATM or debit card",
            "Budget $200 to $300 for winter clothing if you are coming from a warm climate",
            "Ask Student Accounts about Convera if you are wiring tuition internationally",
        ],
        external_link=None,
        source_name="Fordham OIS International Student Pre-Arrival Guide",
        source_url=PRE_ARRIVAL_GUIDE,
    ),
    dict(
        title="Sort out housing before you fly",
        description=(
            "Rose Hill residence halls are undergraduate only. Graduate students mostly live off campus, "
            "with a limited number of university apartments near Rose Hill. Expect roughly $2,000 to $3,000 "
            "for a one-bedroom in the Bronx and $3,000 to $4,000 for a Manhattan studio, plus a security "
            "deposit of about one month's rent. Most students share to bring this down."
        ),
        applies_to="All incoming international students",
        phase="before_arrival",
        position=6,
        is_critical=False,
        deadline_note="Arrange at least temporary housing before you arrive",
        steps=[
            "Join the Residential Life housing waitlist if you want on-campus and were not offered it",
            "Book a hostel or short-stay option if you will apartment-hunt after landing",
            "Never send a deposit or sign a lease before seeing the apartment in person, scams are common",
            "Be suspicious of any landlord asking for untraceable payment methods",
        ],
        external_link="https://www.fordham.edu/student-life/living-on-campus/",
        source_name="Fordham OIS International Student Pre-Arrival Guide",
        source_url=PRE_ARRIVAL_GUIDE,
    ),
    # ---------- First 10 days ----------
    dict(
        title="Complete your OIS immigration check-in",
        description=(
            "This is the single most important thing on this list. Check-in is how Fordham activates your "
            "SEVIS record. OIS warns that failing to complete it can result in the termination of your legal "
            "stay in the United States. You must already be inside the US to check in."
        ),
        applies_to="All new F-1 and J-1 students",
        phase="first_10_days",
        position=0,
        is_critical=True,
        deadline_note="Within 10 days of arriving in the US",
        steps=[
            "Arrive in the US first, you cannot check in from abroad",
            "Complete the online check-in form on the OIS site",
            "Upload a copy of your F-1 visa page (Canadians upload the passport page)",
            "Upload your I-94 record from the CBP website",
            "Email ois@fordham.edu with your Fordham ID in the subject if the form breaks",
        ],
        external_link=OIS_SITE,
        source_name="Fordham OIS check-in guidance",
        source_url=OIS_SITE,
    ),
    dict(
        title="Attend the mandatory OIS orientation",
        description=(
            "OIS runs its own orientation for international students arriving in the Fall and Spring terms, "
            "separate from any school or department orientation. It is mandatory, and times and locations "
            "are confirmed over the summer."
        ),
        applies_to="All new international students",
        phase="first_10_days",
        position=1,
        is_critical=True,
        deadline_note="Scheduled at the start of the Fall and Spring terms",
        steps=[
            "Check fordham.edu/ois under Programs and Events for your session",
            "Note it is separate from your department or school orientation",
        ],
        external_link=OIS_SITE,
        source_name="Fordham OIS International Student Pre-Arrival Guide",
        source_url=PRE_ARRIVAL_GUIDE,
    ),
    dict(
        title="Upload immunization records to the Student Health Portal",
        description=(
            "Missing immunization paperwork is one of the most common reasons students hit a registration "
            "hold. Submit everything through the Student Health Portal rather than email. If you cannot get "
            "the right documentation, Health Services can vaccinate you for a small charge."
        ),
        applies_to="All incoming students",
        phase="first_10_days",
        position=2,
        is_critical=True,
        deadline_note="Before registering for classes, a hold blocks registration",
        steps=[
            "Open your Fordham account, go to My Apps, then the Student Health Portal",
            "Click My Forms and complete the required medical and immunization forms",
            "Upload your supporting documentation in the portal",
            "Email health@fordham.edu if a hold is still showing after you submit",
        ],
        external_link="https://www.fordham.edu/health",
        source_name="Fordham OIS International Student Pre-Arrival Guide",
        source_url=PRE_ARRIVAL_GUIDE,
    ),
    dict(
        title="Waive or keep the Fordham health insurance",
        description=(
            "Students in F-1 or J-1 status must carry health insurance, and Fordham automatically bills you "
            "for its plan unless you actively waive it. The 2025/2026 annual rate was $4,994, split as "
            "$1,805 for the fall and $3,189 for the spring, and considerably more with a spouse or "
            "children. If you do nothing, you pay. If you have comparable outside coverage, you can waive."
        ),
        applies_to="All students in F-1 or J-1 status",
        phase="first_10_days",
        position=3,
        is_critical=True,
        deadline_note="Waiver must be filed at the start of each fall semester, or you are billed automatically",
        steps=[
            "Check what counts as comparable coverage on the Health Services site",
            "Complete the online waiver form AND send supporting documents to University Health Services",
            "Confirm the charge is removed from your student account afterwards",
        ],
        external_link="https://www.fordham.edu/health",
        source_name="Fordham OIS International Student Pre-Arrival Guide",
        source_url=PRE_ARRIVAL_GUIDE,
    ),
    dict(
        title="Open a US bank account",
        description=(
            "You do not need a Social Security number to open a bank account. Some banks ask for a letter "
            "proving you are an international student, which OIS will write for you. There are branches "
            "within walking distance of both campuses."
        ),
        applies_to="All international students",
        phase="first_10_days",
        position=4,
        is_critical=False,
        deadline_note="Useful in your first week or two",
        steps=[
            "Email ois@fordham.edu if the bank asks for a student letter",
            "Near Rose Hill: TD Bank at 640 E Fordham Rd, Chase at 2402 Arthur Ave",
            "Near Lincoln Center: Chase at 1860 Broadway, TD Bank at 1873 Broadway",
            "Bring passport, I-20, and proof of your address",
        ],
        external_link=None,
        source_name="Fordham OIS International Student Pre-Arrival Guide",
        source_url=PRE_ARRIVAL_GUIDE,
    ),
    # ---------- First semester ----------
    dict(
        title="Register full-time to keep your status",
        description=(
            "Immigration rules require a full-time course load: 9 credits for graduate students, 12 for "
            "undergraduates, and 18 hours a week for IALC students. Your department may require more than "
            "the immigration minimum. Dropping below full-time without OIS approval puts your status at "
            "risk."
        ),
        applies_to="All F-1 and J-1 students",
        phase="first_semester",
        position=0,
        is_critical=True,
        deadline_note="Every fall and spring term, from late August and late January",
        steps=[
            "Clear any registration holds first, immunization holds are the usual culprit",
            "Register for at least 9 credits as a graduate student",
            "Talk to OIS before dropping a course if it takes you under full-time",
        ],
        external_link=None,
        source_name="Fordham OIS International Student Pre-Arrival Guide",
        source_url=PRE_ARRIVAL_GUIDE,
    ),
    dict(
        title="Understand what work you are actually allowed to do",
        description=(
            "In your first academic year the only work permitted is part-time on-campus employment, up to "
            "20 hours a week during the term and up to 40 during summer and winter breaks. Fordham's own "
            "policies may lower that further. OIS is blunt that on-campus jobs are hard to get and pay "
            "little, so do not build your budget around one."
        ),
        applies_to="F-1 students in their first academic year",
        phase="first_semester",
        position=1,
        is_critical=True,
        deadline_note="Applies from day one, unauthorized work is a status violation",
        steps=[
            "On-campus only during your first academic year",
            "Maximum 20 hours a week while classes are in session",
            "Never start any off-campus work without written CPT or OPT authorization",
        ],
        external_link=None,
        source_name="Fordham OIS International Student Pre-Arrival Guide",
        source_url=PRE_ARRIVAL_GUIDE,
    ),
    dict(
        title="Apply for a Social Security number once you have a job",
        description=(
            "Your Fordham ID number is not a Social Security number and cannot be used as one. You are only "
            "eligible to apply for an SSN once you have secured authorized employment. You can still open a "
            "bank account and get a phone without one."
        ),
        applies_to="F-1 students with an authorized job offer",
        phase="first_semester",
        position=2,
        is_critical=False,
        deadline_note="Only after you have authorized employment lined up",
        steps=[
            "Get your job offer and work authorization first",
            "Ask OIS what supporting letters you need for the SSA appointment",
            "Never share your SSN with anyone who calls you asking for it",
        ],
        external_link=None,
        source_name="Fordham OIS International Student Pre-Arrival Guide",
        source_url=PRE_ARRIVAL_GUIDE,
    ),
    # ---------- Ongoing ----------
    dict(
        title="Get a travel signature before leaving the US",
        description=(
            "Your I-20 needs a valid travel signature from a Fordham advisor before you re-enter the "
            "country. Request it from OIS well ahead of any trip home, not the week you fly."
        ),
        applies_to="F-1 and J-1 students travelling internationally",
        phase="ongoing",
        position=0,
        is_critical=True,
        deadline_note="Request from OIS well before you travel",
        steps=[
            "Request the signature through OIS before booking or at least well before departure",
            "Carry your signed I-20, valid passport, and valid visa when you return",
        ],
        external_link=OIS_SITE,
        source_name="Fordham OIS",
        source_url=OIS_SITE,
    ),
    dict(
        title="Know the scam playbook before someone tries it on you",
        description=(
            "The Department of Homeland Security has reported scammers impersonating government officials "
            "or university staff and threatening international students' immigration status to extract money "
            "or personal details. Real officials do not call demanding immediate payment."
        ),
        applies_to="All international students",
        phase="ongoing",
        position=1,
        is_critical=False,
        deadline_note="Ongoing, these calls spike around registration and tax season",
        steps=[
            "Never share your SSN, bank details, or visa information with an unexpected caller",
            "Write down the caller's name, number, and organization",
            "Hang up if they pressure you, then email ois@fordham.edu to report it",
        ],
        external_link=None,
        source_name="Fordham OIS International Student Pre-Arrival Guide",
        source_url=PRE_ARRIVAL_GUIDE,
    ),
    # ---------- Employment authorization ----------
    dict(
        title="Apply for CPT before you start an internship",
        description=(
            "CPT lets you work off campus when the job is an integral part of your degree, either tied to a "
            "course you are taking for credit or required of everyone in your program. You generally need "
            "nine consecutive months of full-time enrollment first, though Gabelli graduate students "
            "qualify after two trimesters. You must already have the job offer, and authorization is issued "
            "one term at a time."
        ),
        applies_to="F-1 students with an internship or job offer tied to their degree",
        phase="employment",
        position=0,
        is_critical=True,
        deadline_note="Start 3 to 4 weeks ahead; OIS needs 2 to 3 business days after a complete application",
        steps=[
            "Confirm you meet the enrollment requirement for your program",
            "Get an employer letter on letterhead with job title, dates, hours per week, and duties",
            "Ask your academic advisor to submit the CPT form through the OIS CPT Portal",
            "Wait for the new CPT-authorized I-20, you cannot legally start work before it arrives",
            "Reapply for each additional term the job continues into",
        ],
        external_link=CPT_PAGE,
        source_name="Fordham OIS CPT guidance and CPT form",
        source_url=CPT_FORM,
    ),
    dict(
        title="File for OPT in your final year",
        description=(
            "OPT gives you up to 12 months of work authorization after graduation. Two clocks matter: you "
            "cannot file with USCIS earlier than 90 days before your program end date or later than 60 days "
            "after it, and you must file within 30 days of OIS entering the recommendation in SEVIS. Miss "
            "the window and there is no appeal. Recent USCIS processing has run several months, so file at "
            "the earliest point you can."
        ),
        applies_to="F-1 students in their final year",
        phase="employment",
        position=1,
        is_critical=True,
        deadline_note="File no earlier than 90 days before your program end date and no later than 60 days after",
        steps=[
            "Request the OPT recommendation from OIS first, they update SEVIS and issue a new I-20",
            "File Form I-765 with USCIS within 30 days of that recommendation",
            "Do not work until your EAD card arrives with a valid start date",
            "Confirm current fees and processing times on the USCIS page, both change",
        ],
        external_link=USCIS_OPT,
        source_name="USCIS OPT guidance",
        source_url=USCIS_OPT,
    ),
]

COURSES = [
    dict(
        code="MSDS",
        title="M.S. in Data Science, program structure",
        program="MS Data Science",
        credits=30,
        recommended_term="Full program",
        description=(
            "The M.S. in Data Science is 10 courses totalling 30 credits: five core courses, four "
            "electives, and a capstone project. Core courses carry the DATI attribute in the bulletin and "
            "electives that count toward the degree carry the DATA attribute, which is the quickest way to "
            "check whether a course you like actually counts."
        ),
        tips=(
            "For F-1 status you need 9 credits a term to be full-time, so three courses a semester is the "
            "standard load. Check the attribute code in the course listing before you register, not after."
        ),
    ),
]


def _sync(db, model, rows, key_field, *, prune=True):
    """Make the table match `rows` exactly, matched on key_field.

    These tables hold curated reference content, not user data, so dropping rows that are no
    longer in the seed is how corrections and removals actually propagate. Student-submitted
    content lives in `submissions` and is never touched here.
    """
    existing = {getattr(obj, key_field): obj for obj in db.query(model).all()}
    for row in rows:
        current = existing.get(row[key_field])
        if current is None:
            db.add(model(**row))
        else:
            for field, value in row.items():
                setattr(current, field, value)
    if prune:
        keep = {row[key_field] for row in rows}
        for key, obj in existing.items():
            if key not in keep:
                db.delete(obj)
    db.flush()


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Contacts are pruned last: paperwork rows reference them, so the dependents go first.
        _sync(db, Contact, CONTACTS, "name", prune=False)
        _sync(db, Course, COURSES, "code")

        contacts_by_office = {c.office: c for c in db.query(Contact).all()}
        routing = {
            "immigration": contacts_by_office.get("OIS"),
            "health": contacts_by_office.get("Health Services"),
            "academics": contacts_by_office.get("Academic Records"),
            "money": contacts_by_office.get("Student Accounts"),
            "housing": contacts_by_office.get("Residential Life"),
        }
        owner_by_title = {
            "Upload immunization records to the Student Health Portal": routing["health"],
            "Waive or keep the Fordham health insurance": routing["health"],
            "Get your immunization records translated": routing["health"],
            "Plan your budget and first-month cash": routing["money"],
            "Sort out housing before you fly": routing["housing"],
            "Register full-time to keep your status": routing["academics"],
        }

        rows = [
            {
                **item,
                "last_verified": VERIFIED,
                "contact_id": (owner_by_title.get(item["title"]) or routing["immigration"]).id,
            }
            for item in PAPERWORK
        ]
        _sync(db, PaperworkItem, rows, "title")

        keep_contacts = {c["name"] for c in CONTACTS}
        for contact in db.query(Contact).all():
            if contact.name not in keep_contacts:
                db.delete(contact)

        db.commit()
        print(f"Seed complete: {len(CONTACTS)} contacts, {len(PAPERWORK)} paperwork items, {len(COURSES)} programs.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
