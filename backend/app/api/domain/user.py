import uuid

from datetime import datetime
from typing import Any, List, Tuple

from sqlalchemy.orm import Session
from sqlalchemy import select, inspect

from app.api import schemas
from app.api import models
from app.core.security import verify_password, get_password_hash
from app.api.repositories.postgres import PostgresRepo


def authenticate(session: Session, email: str, password: str) -> models.User | None:
    db_service = PostgresRepo(session, models.User)
    db_user = db_service.read_by("email", email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):  # type: ignore
        return None
    return db_user  # type: ignore


def create_user(session: Session, user_create: schemas.UserCreate) -> models.User:
    db_service = PostgresRepo(session, models.User)
    new_user = user_create.model_dump(exclude={"password"})
    new_user["hashed_password"] = get_password_hash(user_create.password)
    return db_service.create(new_user)  # type: ignore


def update_user(
    session: Session, user_id: uuid.UUID, user_in: schemas.UserUpdate
) -> models.User:
    db_service = PostgresRepo(session, models.User)

    user_data = user_in.model_dump(exclude_unset=True)
    password = user_data.pop("password", None)
    if password:
        user_data["hashed_password"] = get_password_hash(password)

    return db_service.update(user_id, new_user)  # type: ignore


def get_user_by_email(session: Session, email: str) -> models.User | None:
    db_service = PostgresRepo(session, models.User)
    session_user = db_service.read_by("email", email)
    return session_user  # type: ignore
