from fastapi import APIRouter

from sqlalchemy import func, select, distinct

from app.api.deps import SessionDep
from app.api.schemas import UsersOut
from app.api.database import list_users

router = APIRouter()


@router.get("/", response_model=UsersOut)
def read_users(session: SessionDep, skip: int = 0, limit: int = 100):
    """
    Retrieve users.
    """
