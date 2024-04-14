from typing import Type, Sequence, Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select

from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
)
from app.api import schemas
from app.api import models
from app.api.domain import user as user_domain
from app.core.config import settings
from app.core.security import verify_password, get_password_hash
from app.api.repositories.postgres import PostgresRepo


router = APIRouter()


@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=schemas.UsersOut,
)
def read_users(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    db_service = PostgresRepo(session, models.User)
    users = db_service.list()
    users = session.scalars(select(models.User)).all()
    return schemas.UsersOut(data=users) # types: ignore


@router.post(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=schemas.UserOut,
)
def create_user(*, session: SessionDep, user_in: schemas.UserCreate) -> Any:
    user = user_domain.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = user_domain.create_user(session=session, user_create=user_in)
    if settings.emails_enabled and user_in.email:
        email_data = generate_new_account_email(
            email_to=user_in.email, username=user_in.email, password=user_in.password
        )
        send_email(
            email_to=user_in.email,
            subject=email_data.subject,
            html_content=email_data.html_content,
        )
    return user


@router.patch("/me", response_model=schemas.UserOut)
def update_user_me(
    *, session: SessionDep, user_in: schemas.UserUpdate, current_user: CurrentUser
) -> Any:
    db_service = PostgresRepo(session, models.User)
    if user_in.email:
        existing_user = user_domain.get_user_by_email(session, user_in.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=409, detail="User with this email already exists"
            )
    update_dict = user_in.model_dump(exclude_unset=True)
    updated = db_service.update(current_user.id, update_dict)
    return updated


@router.patch("/me/password", response_model=schemas.Message)
def update_password_me(
    *, session: SessionDep, body: schemas.UpdatePassword, current_user: CurrentUser
) -> Any:
    db_service = PostgresRepo(session, models.User)
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    if body.current_password == body.new_password:
        raise HTTPException(
            status_code=400, detail="New password cannot be the same as the current one"
        )
    hashed_password = get_password_hash(body.new_password)
    pw_dict = {"hashed_password": hashed_password}
    db_service.update(current_user.id, pw_dict)
    return schemas.Message(message="Password updated successfully")


@router.get("/me", response_model=schemas.UserOut)
def read_user_me(session: SessionDep, current_user: CurrentUser) -> Any:
    return current_user


@router.post("/signup", response_model=schemas.UserOut)
def register_user(session: SessionDep, user_in: schemas.UserRegister) -> Any:
    if not settings.USERS_OPEN_REGISTRATION:
        raise HTTPException(
            status_code=403,
            detail="Open user registration is forbidden on this server",
        )
    db_service = PostgresRepo(session, models.User)
    user = db_service.read_by("email", user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    user_create = schemas.UserCreate.model_validate(user_in)
    user = user_domain.create_user(session=session, user_create=user_create)

    return user


@router.get("/{user_id}", response_model=schemas.UserOut)
def read_user_by_id(
    user_id: int, session: SessionDep, current_user: CurrentUser
) -> Any:
    user = session.get(models.User, user_id)
    if user == current_user:
        return user
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403,
            detail="The user doesn't have enough privileges",
        )
    return user
