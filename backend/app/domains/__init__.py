"""Importing this package registers every domain's SQLAlchemy models on Base.metadata."""

from app.domains.auth import models as auth_models  # noqa: F401
from app.domains.boards import models as boards_models  # noqa: F401
from app.domains.calendar import models as calendar_models  # noqa: F401
from app.domains.contacts import models as contacts_models  # noqa: F401
from app.domains.courses import models as courses_models  # noqa: F401
from app.domains.paperwork import models as paperwork_models  # noqa: F401
from app.domains.submissions import models as submissions_models  # noqa: F401
