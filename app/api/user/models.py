import uuid as uuid_pkg

from datetime import datetime
from pydantic import EmailStr, field_serializer
from sqlmodel import Field, Relationship, SQLModel

from app.api.appointment import Appointment


class User(SQLModel, table=True):
    id: uuid_pkg.UUID = Field(default=None, primary_key=True)
    username: str
    email: EmailStr
    shop_name: str
    is_active: bool
    created_at: datetime
    appointments: list[Appointment] = Relationship(back_populates="artist")

    @field_serializer("id", check_fields=False)
    def serialize_uuid(self, id: uuid_pkg.UUID) -> str:
        return str(id)

    @field_serializer("created_at", check_fields=False)
    def serialize_datetime(self, datetime: datetime) -> str:
        return datetime.isoformat("T", "minutes")
