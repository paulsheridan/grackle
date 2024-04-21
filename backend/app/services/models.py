import uuid

from typing import TYPE_CHECKING, Optional, List
from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime, timezone, time, date

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
        default=None, foreign_key="service.id", nullable=False
    )
    service: "Service" = Relationship(
        back_populates="workinghours",
        sa_relationship_kwargs={"cascade": "delete"},
    )


class WorkingHoursCreate(SQLModel):
    weekday: int
    open: time
    close: time


class ServiceBase(SQLModel):
    name: str
    active: bool
    duration: int
    max_per_day: int
    start: datetime
    end: datetime


class Service(ServiceBase, table=True):
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    user_id: uuid.UUID | None = Field(
        default=None, foreign_key="user.id", nullable=False
    )
    user: "User" = Relationship(back_populates="services")
    appointments: list["Appointment"] = Relationship(back_populates="service")
    workinghours: list["WorkingHours"] = Relationship(back_populates="service")

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
    user_id: uuid.UUID


class ServiceRegister(SQLModel):
    name: str
    active: bool
    duration: int
    max_per_day: int
    start: datetime
    end: datetime

    workinghours: list["WorkingHours"]


class ServiceUpdate(SQLModel):
    name: str | None = None
    active: bool | None = None
    duration: int | None = None
    max_per_day: int | None = None
    start: datetime | None = None
    end: datetime | None = None


class ServiceOut(ServiceBase):
    id: uuid.UUID

    workinghours: list["WorkingHours"]


class ServicesOut(SQLModel):
    data: list[ServiceOut]


class Availability(SQLModel):
    date: date
    windows: List[dict[str, datetime]]


class Availabilities(SQLModel):
    data: list[Availability]
