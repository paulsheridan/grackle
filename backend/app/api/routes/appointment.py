from typing import Any
from datetime import datetime

from fastapi import APIRouter, HTTPException
from sqlalchemy import func, select, update, delete

from app.api.deps import CurrentUser, SessionDep
from app.api.models import Appointment
from app.api.schemas import (
    AppointmentBase,
    AppointmentCreate,
    AppointmentOut,
    AppointmentsOut,
    AppointmentUpdate,
    Message,
)

router = APIRouter()


@router.get("/", response_model=AppointmentsOut)
def list_appointments(
    session: SessionDep,
    current_user: CurrentUser,
    start: datetime,
    end: datetime,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    stmt = (
        select(Appointment)
        .where(Appointment.user_id == current_user.id)
        .where(Appointment.start.between(start, end).offset(skip).limit(limit))
    )
    appointments = session.scalars(stmt).all()

    return AppointmentsOut(data=appointments)


@router.get("/{id}", response_model=AppointmentOut)
def get_appointment(session: SessionDep, current_user: CurrentUser, id: int) -> Any:
    appointment = session.execute(select(Appointment).where(Appointment.id == id))
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if not current_user.is_superuser and (appointment.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return appointment


@router.post("/", response_model=AppointmentOut)
def create_appointment(
    *, session: SessionDep, current_user: CurrentUser, appointment_in: AppointmentCreate
) -> Any:
    appointment = AppointmentCreate.model_validate(
        appointment_in, update={"owner_id": current_user.id}
    )
    session.add(appointment)
    session.commit()
    session.refresh(appointment)
    return appointment


@router.put("/{id}", response_model=AppointmentOut)
def update_appointment(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: int,
    appointment_in: AppointmentUpdate
) -> Any:
    appointment = session.get(Appointment, id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if not current_user.is_superuser and (appointment.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = appointment_in.model_dump(exclude_unset=True)
    stmt = (
        update(Appointment)
        .where(Appointment.id == id)
        .values(update_dict)
        .returning(Appointment)
    )
    return session.execute(stmt)


@router.delete("/{id}")
def delete_appointment(
    session: SessionDep, current_user: CurrentUser, id: int
) -> Message:
    appointment = session.get(Appointment, id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if not current_user.is_superuser and (appointment.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(appointment)
    session.commit()
    return Message(message="Appointment deleted successfully")
