import uuid

from datetime import datetime, timezone, time, date
from typing import TYPE_CHECKING, Optional, List

from sqlmodel import Field, Relationship, SQLModel
from sqlalchemy import UniqueConstraint, Column, String, types, ForeignKey
from pydantic import field_validator

if TYPE_CHECKING:
    from app.appointments.models import Appointment
    from app.users.models import User


class WorkingHours(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )
    weekday: int = Field(index=True)
    open: time
    close: time
    service_id: uuid.UUID | None = Field(
        sa_column=Column(types.Uuid, ForeignKey("service.id", ondelete="CASCADE"))
    )
    service: "Service" = Relationship(back_populates="workinghours")


class WorkingHoursCreate(SQLModel):
    weekday: int
    open: time
    close: time


class ServiceBase(SQLModel):
    name: str
    active: bool
    duration: int
    max_per_day: int
    start: date
    end: date


class Service(ServiceBase, table=True):
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    user_id: uuid.UUID | None = Field(
        sa_column=Column(types.Uuid, ForeignKey("user.id", ondelete="CASCADE"))
    )
    user: "User" = Relationship(back_populates="services")
    appointments: list["Appointment"] = Relationship(back_populates="service")
    workinghours: list["WorkingHours"] = Relationship(
        back_populates="service",
        sa_relationship_kwargs={
            "cascade": "all, delete",
        },
    )

    def get_workinghours(self, to_find: int) -> WorkingHours | None:
        low, high = 0, len(self.workinghours) - 1

        while low <= high:
            mid = (high + low) // 2
            if self.workinghours[mid].weekday < to_find:
                low = mid + 1
            elif self.workinghours[mid].weekday > to_find:
                high = mid - 1
            else:
                return self.workinghours[mid]
        return None


class ServiceCreate(ServiceBase):

    @field_validator("start", "end", mode="before")
    def start_end_must_be_dates_only(cls, d):
        if "T" in d:
            return d.split("T")[0]


class ServiceUpdate(SQLModel):
    name: str | None = None
    active: bool | None = None
    duration: int | None = None
    max_per_day: int | None = None
    start: date | None = None
    end: date | None = None


class ServicePublic(ServiceBase):
    id: uuid.UUID
    user_id: uuid.UUID

    workinghours: list["WorkingHours"]


class ServicesPublic(SQLModel):
    data: list[ServicePublic]


class Availability(SQLModel):
    date: date
    windows: List[dict[str, datetime]]


class Availabilities(SQLModel):
    data: list[Availability]
