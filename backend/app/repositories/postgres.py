import uuid

from typing import Type, Sequence, Any, List
from datetime import datetime, date

from sqlalchemy import select, update, delete, insert

from app.deps import SessionDep
from app.models import Base


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
    ) -> Sequence[Any]:
        stmt = select(self.model).offset(skip).limit(limit)
        if filter_attr:
            requested_attr = getattr(self.model, filter_attr)
            stmt = stmt.filter(requested_attr == filter_val)
        return self.session.scalars(stmt).all()

    def read(self, obj_id: uuid.UUID) -> Base | None:
        stmt = select(self.model).where(self.model.id == obj_id)
        return self.session.scalars(stmt).first()

    def create(self, data_in: dict) -> Any:
        new_obj = self.model(**data_in)
        self.session.add(new_obj)
        self.session.commit()
        return new_obj

    def create_joined(
        self,
        child_model: Any,
        parent_data: dict,
        child_data: Sequence[dict[Any, Any]],
        attr_name: str,
    ) -> Any:
        child_attr = getattr(self.model, attr_name)
        parent = self.model(**parent_data)
        child_models = [child_model(**item) for item in child_data]
        child_attr = child_models

        self.session.add(parent)
        self.session.commit()
        return parent

    def update(self, model_id: uuid.UUID, data_in: dict) -> Any:
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
        start: datetime | date,
        end: datetime | date,
        skip: int | None = None,
        limit: int | None = None,
    ) -> Sequence[Any]:
        stmt = select(self.model).where(
            self.model.start.between(start, end)  # type: ignore
        )
        if skip and limit:
            stmt = stmt.offset(skip).limit(limit)
        if filter_attr:
            requested_attr = getattr(self.model, filter_attr)
            stmt = stmt.filter(requested_attr == filter_val)
        return self.session.scalars(stmt).all()

    def read_by(self, filter_attr: str, filter_val: Any) -> Any:
        requested_attr = getattr(self.model, filter_attr)
        stmt = select(self.model).where(requested_attr == filter_val)
        return self.session.scalars(stmt).first()

    def read_with_join(self, joined: str, filter_attr: str, filter_val: Any) -> Any:
        requested_attr = getattr(self.model, filter_attr)
        joined_attr = getattr(self.model, joined)
        print(joined_attr)
        stmt = select(self.model).join(joined_attr)
        return self.session.scalars(stmt).first()
