import uuid as uuid_pkg

from typing import Optional
from datetime import datetime, time, timezone

from pydantic import BaseModel, EmailStr, Field, field_serializer


class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str]
    shop_name: str
    is_active: Optional[bool] = Field(default=True)
    is_superuser: Optional[bool] = Field(default=False)

    class Config:
        from_attributes = True


class UserCreate(UserBase):
    password: str


class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str | None = None
    shop_name: str


class UserResponse(UserBase):
    id: uuid_pkg.UUID


class UsersResponse(BaseModel):
    data: list[UserResponse]
    count: int


# class Appointment(SQLModel, table=True):
#     id: uuid_pkg.UUID = Field(default=None, primary_key=True)
#     client_email: str
#     start: datetime
#     end: datetime  # TODO: validate that end is after start and that they're both on the same day
#     confirmed: bool = False
#     canceled: bool = False  # TODO: validate that these are mutually exclusive
#     created_at: datetime

#     artist_id: uuid_pkg.UUID | None = Field(
#         default=None, foreign_key="user.id", nullable=False
#     )
#     artist: User | None = Relationship(back_populates="appointments")

#     # @field_serializer("start", "end", "date_created", check_fields=False)
#     # def serialize_datetime(self, datetime: datetime) -> str:
#     #     return datetime.isoformat("T", "minutes")

#     # @field_serializer("id", check_fields=False)
#     # def serialize_uuid(self, id: uuid_pkg.UUID) -> str:
#     #     return str(id)


# class Availability(SQLModel):
#     id: uuid_pkg.UUID = Field(default=None, primary_key=True)
#     date: datetime
#     windows: list["Window"] = Relationship(back_populates="owner")
#     artist_id: uuid_pkg.UUID | None = Field(
#         default=None, foreign_key="user.id", nullable=False
#     )
#     artist: User | None = Relationship(back_populates="appointments")


# class Window(SQLModel):
#     id: uuid_pkg.UUID = Field(default=None, primary_key=True)
#     start: datetime
#     end: datetime
#     availability_id: int | None = Field(
#         default=None, foreign_key="availability.id", nullable=False
#     )
#     availability: Availability | None = Relationship(back_populates="windows")


# class Client(SQLModel, table=True):
#     id: uuid_pkg.UUID = Field(default=None, primary_key=True)
#     email: str
#     first_name: str
#     last_name: str
#     pronouns: str
#     over_18: bool
#     preferred_contact: str
#     phone_number: int
#     reated_at: datetime

#     artist_id: uuid_pkg.UUID | None = Field(
#         default=None, foreign_key="user.id", nullable=False
#     )
#     artist: User | None = Relationship(back_populates="clients")

#     # @field_serializer("id", check_fields=False)
#     # def serialize_uuid(self, id: uuid_pkg.UUID) -> str:
#     #     return str(id)


# class Service(SQLModel, table=True):
#     id: uuid_pkg.UUID = Field(default=None, primary_key=True)
#     name: str
#     active: bool
#     duration: int
#     max_per_day: int
#     start: datetime
#     end: datetime
#     schedule: list["DailySchedule"] = Relationship(back_populates="service")

#     artist_id: uuid_pkg.UUID | None = Field(
#         default=None, foreign_key="user.id", nullable=False
#     )
#     artist: User | None = Relationship(back_populates="appointments")

#     # @field_serializer("start", "end", check_fields=False)
#     # def serialize_datetime(self, datetime: datetime) -> str:
#     #     return datetime.isoformat("T", "minutes")


# class DailySchedule(SQLModel):
#     weekday: int
#     open: time
#     close: time

#     service_id: uuid_pkg.UUID | None = Field(
#         default=None, foreign_key="service.id", nullable=False
#     )
#     service: Service | None = Relationship(back_populates="appointments")

#     # @field_serializer("open", "close", check_fields=False)
#     # def serialize_time(self, time: time):
#     #     return time.isoformat()
