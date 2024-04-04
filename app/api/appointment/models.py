import uuid as uuid_pkg

from datetime import datetime

from pydantic import EmailStr, field_serializer
from sqlmodel import Field, Relationship, SQLModel

from app.api.user.models import User


class Appointment(SQLModel, table=True):
    id: uuid_pkg.UUID = Field(default=None, primary_key=True)
    client_email: EmailStr
    start: datetime
    end: datetime  # TODO: validate that end is after start and that they're both on the same day
    confirmed: bool = False
    canceled: bool = False  # TODO: validate that these are mutually exclusive
    created_at: datetime

    artist_id: uuid_pkg.UUID | None = Field(
        default=None, foreign_key="user.id", nullable=False
    )
    artist: User | None = Relationship(back_populates="appointments")

    @field_serializer("start", "end", "date_created", check_fields=False)
    def serialize_datetime(self, datetime: datetime) -> str:
        return datetime.isoformat("T", "minutes")

    @field_serializer("id", check_fields=False)
    def serialize_uuid(self, id: uuid_pkg.UUID) -> str:
        return str(id)
