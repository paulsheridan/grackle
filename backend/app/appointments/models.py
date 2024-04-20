import uuid

from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime, timezone

if TYPE_CHECKING:
    from app.clients.models import Client
    from app.services.models import Service
    from app.users.models import User


class AppointmentBase(SQLModel):
    start: datetime
    end: datetime  # TODO: validate that end is after start and that they're both on the same day
    confirmed: bool = False
    canceled: bool = False  # TODO: validate that these are mutually exclusive


class Appointment(AppointmentBase, table=True):
    id: uuid.UUID = Field(
        default=uuid.uuid4(), primary_key=True, index=True, nullable=False
    )

    created_at: datetime = Field(datetime.now(timezone.utc), nullable=False)
    last_edited: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    user_id: uuid.UUID = Field(default=None, foreign_key="user.id", nullable=False)
    user: "User" = Relationship(back_populates="appointments")

    client_id: Optional[uuid.UUID] = Field(
        default=None, foreign_key="client.id", nullable=False
    )
    client: Optional["Client"] = Relationship(back_populates="appointments")

    service_id: uuid.UUID = Field(
        default=None, foreign_key="service.id", nullable=False
    )
    service: "Service" = Relationship(back_populates="appointments")


class AppointmentCreate(AppointmentBase):
    user_id: uuid.UUID
    client_id: uuid.UUID
    service_id: uuid.UUID


class AppointmentRegister(SQLModel):
    user_id: uuid.UUID
    client_id: uuid.UUID | None = None
    service_id: uuid.UUID
    start: datetime
    end: datetime


class AppointmentUpdate(SQLModel):
    canceled: bool | None = None
    confirmed: bool | None = None
    start: datetime | None = None
    end: datetime | None = None


class AppointmentOut(AppointmentBase):
    id: uuid.UUID
    user_id: uuid.UUID
    client_id: uuid.UUID


class AppointmentsOut(SQLModel):
    data: list[AppointmentOut]


class ClientAppointmentRequest(SQLModel):
    user_id: uuid.UUID
    client_id: uuid.UUID | None = None
    service_id: uuid.UUID
    start: datetime
    end: datetime

    email: str
    first_name: str
    last_name: str
    pronouns: str
    birthday: datetime
    preferred_contact: str
    phone_number: str
