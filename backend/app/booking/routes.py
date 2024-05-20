import uuid

from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import HTMLResponse
from app.deps import CurrentUser, SessionDep
from app.users.models import User

from app.booking import templates

router = APIRouter()


@router.get("/{user_id}/", response_class=HTMLResponse)
def list_services(user_id: uuid.UUID, session: SessionDep):
    user = session.get(User, user_id)
    return templates.TemplateResponse("partials/reminders/list-row.html")
