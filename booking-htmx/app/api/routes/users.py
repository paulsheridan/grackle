from fastapi import APIRouter
from sqlmodel import col, delete, func, select

from app.api.deps import SessionDep
from app.api.models import (
    User,
    UsersResponse,
)

router = APIRouter()


@router.get("/", response_model=UsersResponse, tags=["users"])
def read_users(session: SessionDep, skip: int = 0, limit: int = 100) -> UsersResponse:
    """
    Retrieve users.
    """

    count_statement = select(func.count()).select_from(User)
    count = session.exec(count_statement).one()

    statement = select(User).offset(skip).limit(limit)
    users = session.exec(statement).all()

    return UsersResponse(data=users, count=count)  # type: ignore
