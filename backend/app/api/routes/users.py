from fastapi import APIRouter

from sqlalchemy import func, select, distinct

from app.api.deps import SessionDep
from app.api.schemas import UsersOut
from app.api.models import (
    User,
)

router = APIRouter()


@router.get("/", response_model=UsersOut)
def read_users(session: SessionDep, skip: int = 0, limit: int = 100):
    """
    Retrieve users.
    """
    count = session.query(User.id).count()
    users = session.query(User).offset(skip).limit(limit).all()

    return UsersOut(data=users, count=count)  # type: ignore # types: ignore
