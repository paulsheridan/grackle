import uuid

from typing import Any, Union, Sequence
from datetime import datetime

from fastapi import APIRouter, HTTPException
from sqlalchemy import select, update, delete

from app.api.deps import CurrentUser, SessionDep
from app.api.models import Appointment, Client
from app.api.repositories.db_service import PostgresService
from app.api.schemas import (
    AppointmentCreate,
    AppointmentOut,
    AppointmentsOut,
    AppointmentUpdate,
    AppointmentRegister,
    ClientRegister,
    ClientCreate,
    ClientOut,
    Message,
)


router = APIRouter()


@router.get("/", response_model=AppointmentsOut)
def list_appointments(
    session: SessionDep,
    current_user: CurrentUser,
    start: datetime | None = None,
    end: datetime | None = None,
    skip: int = 0,
    limit: int = 100,
) -> AppointmentsOut:
    db_service = PostgresService(session, Appointment)
    if not start or not end:
        appointments = db_service.list(current_user.id, skip, limit)
    else:
        appointments = db_service.list_between_dates(
            current_user.id, start, end, skip, limit
        )
    return AppointmentsOut(data=appointments)  # type: ignore


@router.get("/{appt_id}", response_model=AppointmentOut)
def get_appointment(
    session: SessionDep, current_user: CurrentUser, appt_id: uuid.UUID
) -> Any:
    db_service = PostgresService(session, Appointment)
    appointment = db_service.read(appt_id)

    if not appointment:
        raise HTTPException(status_code=404, detail="Not found")
    if not current_user.is_superuser and (appointment.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not authorized")
    return appointment


@router.post("/", response_model=AppointmentOut)
def create_appointment(
    session: SessionDep, current_user: CurrentUser, appt_in: AppointmentCreate
) -> Any:
    db_service = PostgresService(session, Appointment)

    existing_in_timeslot = db_service.read_by("start", appt_in.start)
    if existing_in_timeslot:
        raise HTTPException(status_code=409, detail="Appointment time already booked.")

    appt_in.user_id = current_user.id
    db_service = PostgresService(session, Appointment)
    appointment = db_service.create(appt_in.model_dump())
    return appointment


@router.patch("/{appt_id}", response_model=AppointmentOut)
def update_appointment(
    session: SessionDep,
    current_user: CurrentUser,
    appt_id: uuid.UUID,
    appointment_in: AppointmentUpdate,
) -> Any:
    db_service = PostgresService(session, Appointment)
    appointment = db_service.read(appt_id)

    if not appointment:
        raise HTTPException(status_code=404, detail="Not Found")
    if not current_user.is_superuser and (appointment.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not authorized")

    update_dict = appointment_in.model_dump(exclude_none=True)
    updated = db_service.update(appt_id, update_dict)


@router.delete("/{appt_id}")
def delete_appointment(
    session: SessionDep, current_user: CurrentUser, appt_id: uuid.UUID
) -> Message:
    db_service = PostgresService(session, Appointment)
    appointment = db_service.read(appt_id)

    if not appointment:
        raise HTTPException(status_code=404, detail="Not Found")
    if not current_user.is_superuser and (appointment.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not authorized")

    db_service.delete(appt_id)
    return Message(message="Appointment deleted successfully")


@router.post("/request", response_model=Union[AppointmentOut, ClientOut])
def request_appointment(
    session: SessionDep,
    appt_in: AppointmentRegister,
    client_in: ClientRegister,
):
    appt_service = PostgresService(session, Appointment)
    client_service = PostgresService(session, Client)

    existing_in_timeslot = appt_service.read_by("start", appt_in.start)
    if existing_in_timeslot:
        raise HTTPException(status_code=409, detail="Appointment time already booked.")

    existing_client = client_service.read_by("email", client_in.email)
    if existing_client:
        client = existing_client
    else:
        print("I'm creating this client now")
        client = client_service.create(client_in.model_dump())
        print(client)
    appt_in = appt_in.model_copy(update={"client_id": client.id})
    print(appt_in)

    appointment = appt_service.create(appt_in.model_dump())

    if client:
        return client
    if appointment:
        return appointment
