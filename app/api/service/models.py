import uuid as uuid_pkg

from datetime import datetime, time
from typing import Optional

from pydantic import field_serializer, field_validator
from sqlmodel import Field, Relationship, SQLModel


from app.api.user.models import User


class Service(SQLModel, table=True):
    id: uuid_pkg.UUID = Field(default=None, primary_key=True)
    name: str
    active: bool
    duration: int
    max_per_day: int
    start: datetime
    end: datetime
    schedule: list["DailySchedule"] = Relationship(back_populates="service")

    artist_id: uuid_pkg.UUID | None = Field(
        default=None, foreign_key="user.id", nullable=False
    )
    artist: User | None = Relationship(back_populates="appointments")

    def get_daily_schedule(self, to_find: int) -> Optional["DailySchedule"]:
        low, high = 0, len(self.schedule) - 1

        while low <= high:
            mid = (high + low) // 2
            if self.schedule[mid].weekday < to_find:
                low = mid + 1
            elif self.schedule[mid].weekday > to_find:
                high = mid - 1
            else:
                return self.schedule[mid]
        return None


class DailySchedule(SQLModel):
    weekday: int
    open: time
    close: time

    service_id: uuid_pkg.UUID | None = Field(
        default=None, foreign_key="service.id", nullable=False
    )
    service: Service | None = Relationship(back_populates="appointments")

    @field_serializer("open", "close", check_fields=False)
    def serialize_time(self, time: time):
        return time.isoformat()
