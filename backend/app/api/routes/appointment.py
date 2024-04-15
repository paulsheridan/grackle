import uuid

from typing import Any, Union, Sequence
from datetime import datetime

from fastapi import APIRouter, HTTPException
from sqlalchemy import select, update, delete
from psycopg.errors import ForeignKeyViolation

from app.api import schemas
from app.api import models
from app.api.deps import CurrentUser, SessionDep
from app.api.repositories.postgres import PostgresRepo


router = APIRouter()


@router.get("/", response_model=schemas.AppointmentsOut)
def list_appointments(
    session: SessionDep,
    current_user: CurrentUser,
    start: datetime | None = None,
    end: datetime | None = None,
    skip: int = 0,
    limit: int = 100,
) -> schemas.AppointmentsOut:
    repo = PostgresRepo(session, models.Appointment)
    if not start or not end:
        appointments = repo.list("user_id", current_user.id, skip, limit)
    else:
        appointments = repo.list_between_dates(
            "user_id", current_user.id, start, end, skip, limit
        )
    return schemas.AppointmentsOut(data=appointments)  # type: ignore


@router.get("/{appt_id}", response_model=schemas.AppointmentOut)
def get_appointment(
    session: SessionDep, current_user: CurrentUser, appt_id: uuid.UUID
) -> Any:
    repo = PostgresRepo(session, models.Appointment)
    appointment = repo.read(appt_id)

    if not appointment:
        raise HTTPException(status_code=404, detail="Not found")
    if not current_user.is_superuser and (appointment.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")
    return appointment


@router.post("/", response_model=schemas.AppointmentOut)
def create_appointment(
    session: SessionDep, current_user: CurrentUser, appt_in: schemas.AppointmentCreate
) -> Any:
    repo = PostgresRepo(session, models.Appointment)

    existing_in_timeslot = repo.read_by("start", appt_in.start)
    if existing_in_timeslot:
        raise HTTPException(status_code=409, detail="Appointment time already booked.")

    appt_in.user_id = current_user.id
    repo = PostgresRepo(session, models.Appointment)
    appointment = repo.create(appt_in.model_dump())
    return appointment


@router.patch("/{appt_id}", response_model=schemas.AppointmentOut)
def update_appointment(
    session: SessionDep,
    current_user: CurrentUser,
    appt_id: uuid.UUID,
    appointment_in: schemas.AppointmentUpdate,
) -> Any:
    repo = PostgresRepo(session, models.Appointment)
    appointment = repo.read(appt_id)

    if not appointment:
        raise HTTPException(status_code=404, detail="Not Found")
    if not current_user.is_superuser and (appointment.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")

    update_dict = appointment_in.model_dump(exclude_none=True)
    updated = repo.update(appt_id, update_dict)
    return updated


@router.delete("/{appt_id}")
def delete_appointment(
    session: SessionDep, current_user: CurrentUser, appt_id: uuid.UUID
) -> schemas.Message:
    repo = PostgresRepo(session, models.Appointment)
    appointment = repo.read(appt_id)

    if not appointment:
        raise HTTPException(status_code=404, detail="Not Found")
    if not current_user.is_superuser and (appointment.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")

    repo.delete(appt_id)
    return schemas.Message(message="Appointment deleted successfully")


@router.post(
    "/request", response_model=Union[schemas.AppointmentOut, schemas.ClientOut]
)
def request_appointment(
    session: SessionDep,
    appt_in: schemas.AppointmentRegister,
    client_in: schemas.ClientRegister,
):
    user_service = PostgresRepo(session, models.User)
    appt_service = PostgresRepo(session, models.Appointment)
    client_service = PostgresRepo(session, models.Client)

    user = user_service.read_by("id", appt_in.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Artist Not Found")

    existing_in_timeslot = appt_service.read_by("start", appt_in.start)
    if existing_in_timeslot:
        raise HTTPException(status_code=409, detail="Appointment time already booked.")

    existing_client = client_service.read_by("email", client_in.email)
    client = client_service.create(client_in.model_dump())
    try:
        if existing_client:
            client = existing_client
        else:
            client = client_service.create(client_in.model_dump())
        appt_in = appt_in.model_copy(update={"client_id": client.id})
    except ForeignKeyViolation:
        raise HTTPException(status_code=404, detail="Artist Not Found")

    appointment = appt_service.create(appt_in.model_dump())

    if client:
        return client
    if appointment:
        return appointment
