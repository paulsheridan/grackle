from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import select

from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
)

from app.api.schemas import UsersOut
from app.api.models import User


router = APIRouter()


@router.get(
    "/", dependencies=[Depends(get_current_active_superuser)], response_model=UsersOut
)
def read_users(session: SessionDep, skip: int = 0, limit: int = 100):

    users = session.scalars(select(User)).all()
    return UsersOut(data=users)  # type: ignore
