from fastapi import APIRouter, HTTPException

from sqlalchemy import func, select, distinct

from app.api.deps import SessionDep, CurrentUser
from app.api.schemas import UsersOut
from app.api.models import (
    User,
)

router = APIRouter()


@router.get("/", response_model=UsersOut)
def read_users(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    stmt = select(User).offset(skip).limit(limit)
    session.execute(stmt)

    return UsersOut(data=users)
