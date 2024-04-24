import uuid

from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime, timezone

# if TYPE_CHECKING:
from app.appointments.models import Appointment
from app.clients.models import Client
from app.services.models import Service


class UserBase(SQLModel):
    email: str = Field(index=True)
    username: str | None = None
    full_name: str | None = None
    shop_name: str | None = None
    is_active: bool | None = Field(default=True)
    is_superuser: bool | None = Field(default=False)


class User(UserBase, table=True):
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )
    hashed_password: str
    created_at: datetime = Field(datetime.now(timezone.utc), nullable=False)
    last_edited: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    appointments: list["Appointment"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={
            "cascade": "all, delete",
        },
    )
    clients: list["Client"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={
            "cascade": "all, delete",
        },
    )
    services: list["Service"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={
            "cascade": "all, delete",
        },
    )


class UserCreate(UserBase):
    password: str


class UserRegister(SQLModel):
    email: str
    password: str
    full_name: str | None = None
    shop_name: str


class UserUpdate(UserBase):
    email: str | None = None  # type: ignore
    password: str | None = None


class UpdatePassword(SQLModel):
    current_password: str
    new_password: str


class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
