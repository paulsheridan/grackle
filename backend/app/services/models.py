import uuid

from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime, timezone, time

from app.appointments.models import Appointment
from app.clients.models import Client
from app.services.models import Service
from app.users.models import User


class WorkingHours(SQLModel):
    weekday: int
    open: time
    close: time
    service_id: uuid.UUID | None = Field(
        default=None, foreign_key="service.id", nullable=False
    )
    service: Service | None = Relationship(back_populates="working_hours")


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
    id: uuid.UUID | None = Field(
        default=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    user_id: uuid.UUID | None = Field(
        default=None, foreign_key="user.id", nullable=False
    )
    user: User | None = Relationship(back_populates="services")
    appointments: list["Appointment"] = Relationship(back_populates="service")
    working_hours: list["WorkingHours"] = Relationship(back_populates="service")

    def get_working_hours(self, to_find: int) -> WorkingHours | None:
        low, high = 0, len(self.working_hours) - 1

        while low <= high:
            mid = (high + low) // 2
            if self.working_hours[mid].weekday < to_find:
                low = mid + 1
            elif self.working_hours[mid].weekday > to_find:
                high = mid - 1
            else:
                return self.working_hours[mid]
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

    working_hours: list["WorkingHours"]


class ServiceUpdate(SQLModel):
    name: str | None = None
    active: bool | None = None
    duration: int | None = None
    max_per_day: int | None = None
    start: datetime | None = None
    end: datetime | None = None


class ServiceOut(ServiceBase):
    id: uuid.UUID

    working_hours: list["WorkingHours"]


class ServicesOut(SQLModel):
    data: list[ServiceOut]
