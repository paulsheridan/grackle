import uuid

from typing import Any, Union, Sequence
from datetime import datetime

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select, col
from psycopg.errors import ForeignKeyViolation

from app.appointments.models import (
    Appointment,
    AppointmentOut,
    AppointmentsOut,
    AppointmentRegister,
    AppointmentCreate,
    AppointmentUpdate,
    ClientAppointmentRequest,
)
from app.clients.models import Client, ClientCreate
from app.users.models import User
from app.services.models import Service

from app.core.models import Message
from app.deps import CurrentUser
from app.deps import SessionDep
from app.clients import domain as client_domain


router = APIRouter()


@router.get("/", response_model=AppointmentsOut)
def list_appointments(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> AppointmentsOut:
    stmt = select(Appointment).where(Appointment.user_id == current_user.id)
    data = session.exec(stmt)
    return AppointmentsOut(data=data)


@router.get("/{appt_id}", response_model=AppointmentOut)
def get_appointment(
    session: SessionDep, current_user: CurrentUser, appt_id: uuid.UUID
) -> Any:
    stmt = select(Appointment).join(Client).where(Appointment.id == appt_id)
    appointment = session.exec(stmt)

    if not appointment:
        raise HTTPException(status_code=404, detail="Not found")
    if not current_user.is_superuser and (appointment.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")
    return appointment


@router.post("/", response_model=AppointmentOut)
def create_appointment(
    session: SessionDep,
    current_user: CurrentUser,
    appt_in: AppointmentRegister,
    client_id: uuid.UUID,
) -> Any:
    db_item = Appointment.model_validate(
        appt_in, update={"user_id": current_user.id, "client_id": client_id}
    )
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


@router.patch("/{appt_id}", response_model=AppointmentOut)
def update_appointment(
    session: SessionDep,
    current_user: CurrentUser,
    appt_id: uuid.UUID,
    appointment_in: AppointmentUpdate,
) -> Any:
    appointment = session.get(Appointment, appt_id)

    if not appointment:
        raise HTTPException(status_code=404, detail="Not Found")
    if not current_user.is_superuser and (appointment.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not authorized")

    update_dict = appointment_in.model_dump(exclude_unset=True)
    appointment.sqlmodel_update(update_dict)
    session.add(appointment)
    session.commit()
    session.refresh(appointment)
    return appointment


@router.delete("/{appt_id}")
def delete_appointment(
    session: SessionDep, current_user: CurrentUser, appt_id: uuid.UUID
) -> Message:
    appointment = session.get(Appointment, appt_id)

    if not appointment:
        raise HTTPException(status_code=404, detail="Not Found")
    if not current_user.is_superuser and (appointment.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not authorized")

    session.delete(appointment)
    session.commit()
    return Message(message="Appointment deleted successfully")


@router.post("/request", response_model=ClientAppointmentRequest)
def request_appointment(session: SessionDep, appt_request: ClientAppointmentRequest):
    user = session.get(User, appt_request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Artist Not Found")

    in_timeslot = session.exec(
        select(Appointment).where(Appointment.start == appt_request.start)
    ).first()
    if in_timeslot:
        raise HTTPException(status_code=409, detail="Appointment time already booked.")

    service = session.get(Service, appt_request.service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service Not Found")

    existing_client = client_domain.get_client_by_email(session, appt_request.email)
    if existing_client:
        client = existing_client
    else:
        client_create = ClientCreate(**appt_request.model_dump())
        client = client_domain.create_client(
            session, appt_request, appt_request.user_id
        )

    appt_request.client_id = client.id
    appointment = Appointment.model_validate(appt_request)
    session.add(appointment)
    session.commit()
    session.refresh(appointment)
    return appt_request
