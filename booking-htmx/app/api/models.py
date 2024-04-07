import uuid
from typing import List, Optional
from datetime import datetime, time, timezone

from sqlalchemy import ForeignKey, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncAttrs


class Base(AsyncAttrs, DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "user"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), default=uuid.uuid4, primary_key=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        default=datetime.now(timezone.utc),
    )
    email: Mapped[str]
    username: Mapped[str]
    hashed_password: Mapped[str]
    full_name: Mapped[Optional[str]]
    shop_name: Mapped[str]
    is_active: bool = True
    is_superuser: bool = False

    # appointments: Mapped[List["Appointment"]] = relationship(
    #     back_populates="artist", cascade="all, delete-orphan"
    # )
    # clients: Mapped[List["Client"]] = relationship(
    #     back_populates="artist", cascade="all, delete-orphan"
    # )
    # services: Mapped[List["Service"]] = relationship(
    #     back_populates="artist", cascade="all, delete-orphan"
    # )
    # availability: Mapped[List["Availability"]] = relationship(
    #     back_populates="artist", cascade="all, delete-orphan"
    # )
