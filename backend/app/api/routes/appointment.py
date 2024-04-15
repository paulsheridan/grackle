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
    session: SessionDep, current_user: CurrentUser, appt_in: schemas.AppointmentRegister
) -> Any:
    repo = PostgresRepo(session, models.Appointment)

    existing_in_timeslot = repo.read_by("start", appt_in.start)
    if existing_in_timeslot:
        raise HTTPException(status_code=409, detail="Appointment time already booked.")

    appt_create = schemas.AppointmentCreate(
        **appt_in.model_dump(), user_id=current_user.id
    )
    appointment = repo.create(appt_create.model_dump())
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


@router.post("/request", response_model=schemas.ClientAppointmentRequest)
def request_appointment(
    session: SessionDep, appt_request: schemas.ClientAppointmentRequest
):
    user_repo = PostgresRepo(session, models.User)
    appt_repo = PostgresRepo(session, models.Appointment)
    client_repo = PostgresRepo(session, models.Client)
    svc_repo = PostgresRepo(session, models.Service)

    user = user_repo.read_by("id", appt_request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Artist Not Found")

    existing_in_timeslot = appt_repo.read_by("start", appt_request.start)
    if existing_in_timeslot:
        raise HTTPException(status_code=409, detail="Appointment time already booked.")

    service = svc_repo.read_by("id", appt_request.service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service Not Found")

    existing_client = client_repo.read_by("email", appt_request.email)
    if existing_client:
        client = existing_client
    else:
        client_create = schemas.ClientCreate(**appt_request.model_dump())
        client = client_repo.create(client_create.model_dump())

    appt_request.client_id = client.id
    appt_create = schemas.AppointmentCreate(**appt_request.model_dump())
    appointment = appt_repo.create(appt_create.model_dump())

    return appt_request
