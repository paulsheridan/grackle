import uuid

from datetime import datetime, timezone, time, date
from typing import TYPE_CHECKING, Optional, List

from sqlmodel import Field, Relationship, SQLModel
from sqlalchemy import UniqueConstraint, Column, String, types, ForeignKey
from pydantic import field_validator

if TYPE_CHECKING:
    from app.appointments.models import Appointment
    from app.users.models import User


class ImageBase(SQLModel):
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )
    url: str

class DesignImage(ImageBase, table=True):
    user_id: uuid.UUID | None = Field(
        default=None, foreign_key="user.id", nullable=False
    )
    user: "User" = Relationship(
        back_populates="available_designs",
    )

class PortfolioImage(ImageBase, table=True):
    portfolio_id: uuid.UUID = Field(
        sa_column=Column(types.Uuid, ForeignKey("portfolio.id", ondelete="CASCADE"))
    )
    portfolio: "Portfolio" = Relationship(back_populates="portfolio_images")


class Portfolio(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )
    tag_line: str
    user_id: uuid.UUID | None = Field(
        default=None, foreign_key="user.id", nullable=False
    )
    user: "User" = Relationship(
        back_populates="portfolio",
        sa_relationship_kwargs={"uselist": False},
    )
    portfolio_images: list["PortfolioImage"] = Relationship(
        back_populates="portfolio",
        sa_relationship_kwargs={
            "cascade": "all, delete",
        },
    )
