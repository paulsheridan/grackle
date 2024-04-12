import uuid

from typing import Optional, List, Sequence
from datetime import datetime, time, timezone

from pydantic import BaseModel, EmailStr, Field, field_serializer, ConfigDict


class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str]
    shop_name: str
    is_active: Optional[bool] = Field(default=True)
    is_superuser: Optional[bool] = Field(default=False)

    model_config = ConfigDict(from_attributes=True)


class User(UserBase):
    id: uuid.UUID
    hashed_password: str

    appointments: List["Appointment"] = []
    clients: List["Client"] = []
    services: List["ServiceBase"] = []
    availabilities: List["Availability"] = []


class UserCreate(UserBase):
    password: str


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    shop_name: str


class UserUpdate(UserBase):
    email: EmailStr | None = None
    password: str | None = None


class UserOut(UserBase):
    id: uuid.UUID


class UsersOut(BaseModel):
    data: Sequence[UserOut]


class AppointmentBase(BaseModel):
    start: datetime
    end: datetime  # TODO: validate that end is after start and that they're both on the same day
    confirmed: bool = False
    canceled: bool = False  # TODO: validate that these are mutually exclusive

    model_config = ConfigDict(from_attributes=True)


class Appointment(AppointmentBase):
    user_id: uuid.UUID
    client_id: uuid.UUID | None = None


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentRegister(BaseModel):
    user_id: uuid.UUID
    client_id: uuid.UUID | None = None
    start: datetime
    end: datetime


class AppointmentUpdate(BaseModel):
    canceled: bool = False
    confirmed: bool = False
    start: datetime | None = None
    end: datetime | None = None


class AppointmentOut(AppointmentBase):
    id: uuid.UUID
    user_id: uuid.UUID
    client_id: uuid.UUID


class AppointmentsOut(BaseModel):
    data: Sequence[AppointmentOut]


class AvailabilityBase(BaseModel):
    pass


class Availability(AvailabilityBase):
    id: uuid.UUID
    date: datetime
    windows: list["Window"]
    user_id: uuid.UUID


class Window(BaseModel):
    id: uuid.UUID
    start: datetime
    end: datetime
    availability_id: uuid.UUID


class ClientBase(BaseModel):
    email: str
    first_name: str
    last_name: str
    pronouns: str
    over_18: bool
    preferred_contact: str
    phone_number: str
    user_id: uuid.UUID


class Client(ClientBase):
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)


class ClientCreate(ClientBase):
    pass


class ClientRegister(BaseModel):
    email: str
    first_name: str
    last_name: str
    pronouns: str
    over_18: bool
    preferred_contact: str
    phone_number: str
    user_id: uuid.UUID


class ClientOut(ClientBase):
    id: uuid.UUID


class ClientsOut(BaseModel):
    data: Sequence[ClientOut]


class ServiceBase(BaseModel):
    pass


class Service(ServiceBase):
    id: uuid.UUID
    name: str
    active: bool
    duration: int
    max_per_day: int
    start: datetime
    end: datetime
    schedule: List["DailySchedule"]
    user_id: uuid.UUID


class DailySchedule(BaseModel):
    weekday: int
    open: time
    close: time
    service_id: uuid.UUID


class AppointmentClientRequest(BaseModel):
    # appointment fields
    appointment: AppointmentRegister
    # client fields
    client: ClientRegister


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: uuid.UUID | None = None


class NewPassword(BaseModel):
    token: str
    new_password: str


# Generic message
class Message(BaseModel):
    message: str
