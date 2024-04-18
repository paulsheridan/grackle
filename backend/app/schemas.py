import uuid

from typing import Optional, List, Sequence
from datetime import datetime, time, timezone

from pydantic import BaseModel, EmailStr, Field, field_serializer, ConfigDict


class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str | None = None
    shop_name: str
    is_active: bool | None = Field(default=True)
    is_superuser: bool | None = Field(default=False)

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


class UserUpdate(BaseModel):
    email: EmailStr | None = None
    username: str | None = None
    full_name: str | None = None
    shop_name: str | None = None


class UpdatePassword(BaseModel):
    current_password: str
    new_password: str


class UserOut(UserBase):
    id: uuid.UUID


class UsersOut(BaseModel):
    data: list[UserOut]


class AppointmentBase(BaseModel):
    start: datetime
    end: datetime  # TODO: validate that end is after start and that they're both on the same day
    confirmed: bool = False
    canceled: bool = False  # TODO: validate that these are mutually exclusive

    model_config = ConfigDict(from_attributes=True, extra="ignore")


class Appointment(AppointmentBase):
    id: uuid.UUID
    user_id: uuid.UUID
    client_id: uuid.UUID
    service_id: uuid.UUID


class AppointmentCreate(AppointmentBase):
    user_id: uuid.UUID
    client_id: uuid.UUID
    service_id: uuid.UUID


class AppointmentRegister(BaseModel):
    user_id: uuid.UUID
    client_id: uuid.UUID | None = None
    service_id: uuid.UUID
    start: datetime
    end: datetime

    model_config = ConfigDict(from_attributes=True, extra="ignore")


class AppointmentUpdate(BaseModel):
    canceled: bool | None = None
    confirmed: bool | None = None
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


class ClientAppointmentRequest(BaseModel):
    user_id: uuid.UUID
    client_id: uuid.UUID | None = None
    service_id: uuid.UUID
    start: datetime
    end: datetime

    email: str
    first_name: str
    last_name: str
    pronouns: str
    birthday: datetime
    preferred_contact: str
    phone_number: str
    # Maybe we wanna send back user details and not IDs


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
    birthday: datetime
    preferred_contact: str
    phone_number: str
    user_id: uuid.UUID

    model_config = ConfigDict(from_attributes=True, extra="ignore")


class Client(ClientBase):
    id: uuid.UUID


class ClientCreate(ClientBase):
    pass


class ClientRegister(BaseModel):
    email: str
    first_name: str
    last_name: str
    pronouns: str
    birthday: datetime
    preferred_contact: str
    phone_number: str
    user_id: uuid.UUID

    model_config = ConfigDict(from_attributes=True, extra="ignore")


class ClientUpdate(BaseModel):
    email: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    pronouns: str | None = None
    birthday: datetime | None = None
    preferred_contact: str | None = None
    phone_number: str | None = None


class ClientOut(ClientBase):
    id: uuid.UUID


class ClientsOut(BaseModel):
    data: Sequence[ClientOut]


class ServiceBase(BaseModel):
    name: str
    active: bool
    duration: int
    max_per_day: int
    start: datetime
    end: datetime

    model_config = ConfigDict(from_attributes=True, extra="ignore")


class Service(ServiceBase):
    id: uuid.UUID
    user_id: uuid.UUID


class ServiceCreate(ServiceBase):
    user_id: uuid.UUID


class ServiceRegister(BaseModel):
    name: str
    active: bool
    duration: int
    max_per_day: int
    start: datetime
    end: datetime

    working_hours: Sequence["WorkingHours"]


class ServiceUpdate(BaseModel):
    name: str | None = None
    active: bool | None = None
    duration: int | None = None
    max_per_day: int | None = None
    start: datetime | None = None
    end: datetime | None = None


class ServiceOut(ServiceBase):
    id: uuid.UUID

    working_hours: Sequence["WorkingHours"]


class ServicesOut(ServiceOut):
    data: list[UserOut]


class WorkingHours(BaseModel):
    weekday: int
    open: time
    close: time
    service_id: uuid.UUID | None = None


class WorkingHoursCreate(BaseModel):
    weekday: int
    open: time
    close: time


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
