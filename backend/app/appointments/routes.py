import uuid
import json

from typing import Any, Union, Sequence, Tuple
from datetime import datetime

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select, col
from psycopg.errors import ForeignKeyViolation

from app.appointments.models import (
    Appointment,
    AppointmentPublic,
    AppointmentsPublic,
    AppointmentCreate,
    AppointmentUpdate,
    ClientAppointmentRequest,
    ClientAppointmentResponse,
    ApptsJoinSvcsClients,
)
from app.appointments.domain import list_appts_between_dates
from app.clients.models import Client, ClientCreate, ClientsPublic, ClientPublic
from app.users.models import User
from app.services.models import Service

from app.core.models import Message
from app.deps import CurrentUser
from app.deps import SessionDep
from app.clients import domain as client_domain


router = APIRouter()


@router.get("/", response_model=ApptsJoinSvcsClients)
def list_appointments(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> ApptsJoinSvcsClients:
    stmt = (
        select(Appointment)
        .join(Client, isouter=True)
        .join(Service, isouter=True)
        .where(Appointment.user_id == current_user.id)
    )
    data = session.exec(stmt).all()
    return ApptsJoinSvcsClients(data=data)


@router.get("/schedule/", response_model=ApptsJoinSvcsClients)
def join_appts_svc_clients_between(
    session: SessionDep, current_user: CurrentUser, start: datetime, end: datetime
) -> ApptsJoinSvcsClients:
    data = list_appts_between_dates(session, current_user.id, start, end)
    return ApptsJoinSvcsClients(data=data)


@router.get("/{appt_id}", response_model=AppointmentPublic)
def get_appointment(
    session: SessionDep, current_user: CurrentUser, appt_id: uuid.UUID
) -> Any:
    appointment = session.get(Appointment, appt_id)

    if not appointment:
        raise HTTPException(status_code=404, detail="Not found")
    if not current_user.is_superuser and (appointment.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")
    return appointment


@router.post("/", response_model=AppointmentPublic)
def create_appointment(
    session: SessionDep,
    current_user: CurrentUser,
    appt_in: AppointmentCreate,
) -> Any:
    db_item = Appointment.model_validate(
        appt_in,
        update={
            "user_id": current_user.id,
        },
    )
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


@router.patch("/{appt_id}", response_model=AppointmentPublic)
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


@router.post("/request", response_model=ClientAppointmentResponse)
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
        raise HTTPException(status_code=404, detail="Not Found")

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
    return appointment


@router.get("/{appt_id}/confirmation", response_model=AppointmentPublic)
def get_confirmation(session: SessionDep, appt_id: uuid.UUID) -> Any:
    appointment = session.get(Appointment, appt_id)

    if not appointment:
        raise HTTPException(status_code=404, detail="Not found")
    return appointment
