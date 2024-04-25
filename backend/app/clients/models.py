import uuid

from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime, timezone, date

if TYPE_CHECKING:
    from app.users.models import User
    from app.appointments.models import Appointment


class ClientBase(SQLModel):
    email: str = Field(index=True)
    first_name: str
    last_name: str
    pronouns: str
    birthday: date
    preferred_contact: str
    phone_number: str


class Client(ClientBase, table=True):
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    user_id: uuid.UUID | None = Field(
        default=None, foreign_key="user.id", nullable=False
    )
    user: "User" = Relationship(back_populates="clients")
    appointments: list["Appointment"] = Relationship(back_populates="client")


class ClientCreate(ClientBase):
    pass


class ClientRegister(SQLModel):
    email: str
    first_name: str
    last_name: str
    pronouns: str
    birthday: datetime
    preferred_contact: str
    phone_number: str


class ClientUpdate(SQLModel):
    email: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    pronouns: str | None = None
    birthday: datetime | None = None
    preferred_contact: str | None = None
    phone_number: str | None = None


class ClientOut(ClientBase):
    id: uuid.UUID


class ClientsOut(SQLModel):
    data: list[ClientOut]
