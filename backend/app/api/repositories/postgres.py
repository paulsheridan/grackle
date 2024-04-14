import uuid

from typing import Type, Sequence, Any
from datetime import datetime

from sqlalchemy import select, update, delete

from app.api.deps import SessionDep
from app.api.models import Base


class PostgresRepo:
    def __init__(
        self,
        session: SessionDep,
        model: Type[Base],
    ):
        self.session = session
        self.model = model

    def list(
        self,
        filter_attr: str | None = None,
        filter_val: Any = None,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[Base]:
        stmt = select(self.model).offset(skip).limit(limit)
        if filter_attr:
            requested_attr = getattr(self.model, filter_attr)
            stmt = stmt.filter(requested_attr == filter_val)
        return self.session.scalars(stmt).all()

    def read(self, obj_id: uuid.UUID) -> Base | None:
        stmt = select(self.model).where(self.model.id == obj_id)
        return self.session.scalars(stmt).first()

    def create(self, data_in: dict) -> Base:
        new_obj = self.model(**data_in)
        self.session.add(new_obj)
        self.session.commit()
        self.session.refresh(new_obj)
        return new_obj

    def update(self, model_id: uuid.UUID, data_in: dict) -> Base | None:
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
        self,
        filter_attr: str | None,
        filter_val: Any,
        start: datetime,
        end: datetime,
        skip: int,
        limit: int,
    ) -> Sequence[Base]:
        stmt = select(self.model).where(
            self.model.start.between(start, end).offset(skip).limit(limit)  # type: ignore
        )
        if filter_attr:
            requested_attr = getattr(self.model, filter_attr)
            stmt = stmt.filter(requested_attr == filter_val)
        return self.session.scalars(stmt).all()

    def read_by(self, filter_attr: str, filter_val: Any) -> Base | None:
        requested_attr = getattr(self.model, filter_attr)
        stmt = select(self.model).where(requested_attr == filter_val)
        return self.session.scalars(stmt).first()
