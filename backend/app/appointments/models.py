import uuid

from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime, timezone
from sqlalchemy import UniqueConstraint, Column, String, types, ForeignKey


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
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    created_at: datetime = Field(datetime.now(timezone.utc), nullable=False)
    last_edited: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    user_id: uuid.UUID = Field(
        sa_column=Column(types.Uuid, ForeignKey("user.id", ondelete="SET NULL"))
    )
    user: "User" = Relationship(back_populates="appointments")

    client_id: Optional[uuid.UUID] = Field(
        sa_column=Column(types.Uuid, ForeignKey("client.id", ondelete="SET NULL"))
    )
    client: Optional["Client"] = Relationship(back_populates="appointments")

    service_id: uuid.UUID = Field(
        sa_column=Column(types.Uuid, ForeignKey("service.id", ondelete="SET NULL"))
    )
    service: "Service" = Relationship(back_populates="appointments")


class AppointmentCreate(AppointmentBase):
    user_id: uuid.UUID
    client_id: uuid.UUID
    service_id: uuid.UUID


class AppointmentUpdate(SQLModel):
    canceled: bool | None = None
    confirmed: bool | None = None
    start: datetime | None = None
    end: datetime | None = None


class AppointmentPublic(AppointmentBase):
    id: uuid.UUID
    user_id: uuid.UUID
    client_id: uuid.UUID
    service_id: uuid.UUID


class AppointmentsPublic(SQLModel):
    data: list[AppointmentPublic]


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
