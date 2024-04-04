import uuid as uuid_pkg

from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel

from app.api.user.models import User


class Availability(SQLModel):
    id: uuid_pkg.UUID = Field(default=None, primary_key=True)
    date: datetime
    windows: list["Window"] = Relationship(back_populates="owner")
    artist_id: uuid_pkg.UUID | None = Field(
        default=None, foreign_key="user.id", nullable=False
    )
    artist: User | None = Relationship(back_populates="appointments")


class Window(SQLModel):
    id: uuid_pkg.UUID = Field(default=None, primary_key=True)
    start: datetime
    end: datetime
    availability_id: int | None = Field(
        default=None, foreign_key="availability.id", nullable=False
    )
    availability: Availability | None = Relationship(back_populates="windows")
