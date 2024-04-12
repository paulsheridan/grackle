import uuid

from typing import Type, Sequence, Any
from datetime import datetime

from fastapi import APIRouter, HTTPException
from sqlalchemy import select, update, delete

from app.api.deps import CurrentUser, SessionDep
from app.api.models import UserOwnedMixin


class PostgresService:
    def __init__(
        self,
        session: SessionDep,
        model: Type[UserOwnedMixin],
    ):
        self.session = session
        self.model = model

    def list(
        self, user_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> Sequence[UserOwnedMixin]:
        stmt = (
            select(self.model)
            .where(self.model.user_id == user_id)
            .offset(skip)
            .limit(limit)
        )
        return self.session.scalars(stmt).all()

    def read(self, obj_id: uuid.UUID) -> UserOwnedMixin | None:
        stmt = select(self.model).where(self.model.id == obj_id)
        return self.session.scalars(stmt).first()

    def create(self, data_in: dict) -> UserOwnedMixin:
        new_obj = self.model(**data_in)
        self.session.add(new_obj)
        self.session.commit()
        self.session.refresh(new_obj)
        return new_obj

    def update(self, model_id: uuid.UUID, data_in: dict) -> UserOwnedMixin | None:
        stmt = (
            update(self.model)
            .where(self.model.id == model_id)
            .values(data_in)
            .returning(self.model)
        )
        return self.session.scalar(stmt)

    def delete(self, model_id: uuid.UUID) -> None:
        stmt = delete(self.model).where(self.model.id == model_id)
        return self.session.scalar(stmt)

    def list_between_dates(
        self, user_id: uuid.UUID, start: datetime, end: datetime, skip: int, limit: int
    ):
        stmt = (
            select(self.model)
            .where(self.model.user_id == user_id)
            .where(self.model.start.between(start, end).offset(skip).limit(limit))  # type: ignore
        )
        return self.session.scalars(stmt).all()

    def read_by(self, attr_name: str, attr_val: Any) -> UserOwnedMixin | None:
        requested_attr = getattr(self.model, attr_name)
        stmt = select(self.model).where(requested_attr == attr_val)
        return self.session.scalars(stmt).first()
