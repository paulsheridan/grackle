from fastapi import APIRouter

# from sqlmodel import col, delete, func, select
from sqlalchemy import func, select, distinct

from app.api.deps import SessionDep
from app.api.schemas import UsersResponse
from app.api.models import (
    User,
)

router = APIRouter()


@router.get("/", response_model=UsersResponse, tags=["users"])
def read_users(session: SessionDep, skip: int = 0, limit: int = 100):
    """
    Retrieve users.
    """
    return session.execute(select(User)).all()
