from datetime import datetime
from typing import Any, List, Tuple


from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api.models import User
from app.api.schemas import UserCreate, UserUpdate
from app.core.security import verify_password, get_password_hash


def authenticate(session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create(session: Session, user_create: UserCreate) -> User:
    db_obj = User(
        **user_create.model_dump(exclude={"password"}),
        hashed_password=get_password_hash(user_create.password),
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update(session: Session, user_id: int, user_in: UserUpdate):
    user_data = user_in.model_dump(exclude_unset=True)
    password = user_data.pop("password", None)
    if password:
        user_data["hashed_password"] = get_password_hash(password)
    stmt = (
        update(User)  # type: ignore
        .where(User.id == user_id)
        .values(user_data)
        .returning(User)
    )
    return session.execute(stmt)


def get_user_by_email(session: Session, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    session_user = session.execute(stmt).first()
    return session_user  # type: ignore
