import uuid
from typing import List, Optional
from datetime import datetime, time, timezone

from sqlalchemy import ForeignKey, DateTime, Uuid
from sqlalchemy.types import Boolean, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), default=uuid.uuid4, primary_key=True
    )


class User(Base):
    __tablename__ = "user"

    email: Mapped[str] = mapped_column(unique=True, index=True)
    username: Mapped[str]
    hashed_password: Mapped[str]
    full_name: Mapped[Optional[str]]
    shop_name: Mapped[str] = mapped_column(unique=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    appointments: Mapped[List["Appointment"]] = relationship(
        cascade="all, delete-orphan"
    )
    clients: Mapped[List["Client"]] = relationship(cascade="all, delete-orphan")
    services: Mapped[List["Service"]] = relationship(cascade="all, delete-orphan")
    availabilities: Mapped[List["Availability"]] = relationship(
        cascade="all, delete-orphan"
    )


class Appointment(Base):
    __tablename__ = "appointment"

    start: Mapped[datetime] = mapped_column(DateTime, index=True)
    end: Mapped[datetime] = mapped_column(DateTime, index=True)
    confirmed: Mapped[bool] = mapped_column(Boolean, default=False)
    canceled: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="appointments")

    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("client.id"))
    client: Mapped["Client"] = relationship(back_populates="appointments")

    service_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("service.id"))
    service: Mapped["Service"] = relationship(back_populates="appointments")


class Availability(Base):
    __tablename__ = "availability"

    date: Mapped[datetime]

    windows: Mapped[List["Window"]] = relationship(cascade="all, delete-orphan")

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="availabilities")


class Window(Base):
    __tablename__ = "window"

    start: Mapped[datetime]
    end: Mapped[datetime]

    availability_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("availability.id"))
    availability: Mapped["Availability"] = relationship(back_populates="windows")


class Client(Base):
    __tablename__ = "client"

    email: Mapped[str] = mapped_column(unique=True, index=True)
    first_name: Mapped[str]
    last_name: Mapped[str]
    pronouns: Mapped[Optional[str]]
    birthday: Mapped[datetime] = mapped_column(DateTime)
    preferred_contact: Mapped[str]
    phone_number: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="clients")

    appointments: Mapped[List["Appointment"]] = relationship(
        cascade="all, delete-orphan"
    )


class WorkingHours(Base):
    __tablename__ = "working_hours"

    weekday: Mapped[int]
    open: Mapped[time]
    close: Mapped[time]

    service_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("service.id"))
    service: Mapped["Service"] = relationship(back_populates="working_hours")


class Service(Base):
    __tablename__ = "service"

    name: Mapped[str]
    active: Mapped[bool]
    duration: Mapped[int]
    max_per_day: Mapped[int]
    start: Mapped[datetime]
    end: Mapped[datetime]

    working_hours: Mapped[List["WorkingHours"]] = relationship(
        back_populates="service", cascade="all, delete-orphan"
    )

    appointments: Mapped[List["Appointment"]] = relationship(
        back_populates="service", cascade="all, delete-orphan"
    )

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="services")

    def get_working_hours(self, to_find: int) -> Optional[WorkingHours]:
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
