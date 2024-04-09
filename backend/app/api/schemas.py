import uuid

from typing import Optional, List
from datetime import datetime, time, timezone

from pydantic import BaseModel, EmailStr, Field, field_serializer, ConfigDict


class AppointmentBase(BaseModel):
    id: uuid.UUID
    client_email: str
    start: datetime
    end: datetime  # TODO: validate that end is after start and that they're both on the same day
    confirmed: bool = False
    canceled: bool = False  # TODO: validate that these are mutually exclusive
    artist_id: uuid.UUID

    # @field_serializer("start", "end", "date_created", check_fields=False)
    # def serialize_datetime(self, datetime: datetime) -> str:
    #     return datetime.isoformat("T", "minutes")


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    shop_name: str


class AppointmentUpdate(AppointmentBase):
    email: EmailStr | None = None  # type: ignore
    password: str | None = None


class Availability(BaseModel):
    id: uuid.UUID
    date: datetime
    windows: list["Window"]
    artist_id: uuid.UUID


class Window(BaseModel):
    id: uuid.UUID
    start: datetime
    end: datetime
    availability_id: int


class Client(BaseModel):
    id: uuid.UUID
    email: str
    first_name: str
    last_name: str
    pronouns: str
    over_18: bool
    preferred_contact: str
    phone_number: int
    reated_at: datetime
    artist_id: uuid.UUID


class Service(BaseModel):
    id: uuid.UUID
    name: str
    active: bool
    duration: int
    max_per_day: int
    start: datetime
    end: datetime
    schedule: List["DailySchedule"]
    artist_id: uuid.UUID

    # @field_serializer("start", "end", check_fields=False)
    # def serialize_datetime(self, datetime: datetime) -> str:
    #     return datetime.isoformat("T", "minutes")


class DailySchedule(BaseModel):
    weekday: int
    open: time
    close: time
    service_id: uuid.UUID

    # @field_serializer("open", "close", check_fields=False)
    # def serialize_time(self, time: time):
    #     return time.isoformat()


class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str]
    shop_name: str
    is_active: Optional[bool] = Field(default=True)
    is_superuser: Optional[bool] = Field(default=False)

    appointments: List[AppointmentBase] = []
    clients: List[Client] = []
    services: List[Service] = []
    availabilities: List[Availability] = []

    model_config = ConfigDict(
        from_attributes=True,
    )


class UserCreate(UserBase):
    password: str


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    shop_name: str


class UserUpdate(UserBase):
    email: EmailStr | None = None  # type: ignore
    password: str | None = None


class UserOut(UserBase):
    id: uuid.UUID


class UsersOut(BaseModel):
    data: list[UserOut]
    count: int


# JSON payload containing access token
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(BaseModel):
    sub: int | None = None


class NewPassword(BaseModel):
    token: str
    new_password: str


# Generic message
class Message(BaseModel):
    message: str
