import uuid as uuid_pkg

from datetime import datetime

from pydantic import EmailStr, field_serializer
from sqlmodel import Field, Relationship, SQLModel
from pydantic_extra_types.phone_numbers import PhoneNumber

from app.api.user.models import User


class Client(SQLModel, table=True):
    id: uuid_pkg.UUID = Field(default=None, primary_key=True)
    email: EmailStr
    first_name: str
    last_name: str
    pronouns: str
    over_18: bool
    preferred_contact: str
    phone_number: PhoneNumber
    reated_at: datetime

    artist_id: uuid_pkg.UUID | None = Field(
        default=None, foreign_key="user.id", nullable=False
    )
    artist: User | None = Relationship(back_populates="clients")

    @field_serializer("id", check_fields=False)
    def serialize_uuid(self, id: uuid_pkg.UUID) -> str:
        return str(id)
