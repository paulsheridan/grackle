import uuid
from typing import Type, Sequence, Any, List
from datetime import datetime, date

from sqlmodel import Session, col, delete, func, select

from app.deps import SessionDep
from app.appointments.models import Appointment, AppointmentCreate


def list_appts_between_dates(
    session: SessionDep,
    start: datetime | date,
    end: datetime | date,
    skip: int | None = None,
    limit: int | None = None,
) -> Sequence[Appointment]:
    stmt = (
        select(Appointment)
        .where(col(Appointment.start) >= start)
        .where(col(Appointment.end) <= end)
        .offset(skip)
        .limit(limit)
    )
    return session.exec(stmt).all()


def appointment_by_start_time(
    session: SessionDep,
    start_time: datetime,
) -> list[Appointment]:
    stmt = select(Appointment).where(Appointment.start == start_time)
    results = session.exec(stmt).all()
    return results


def create_appointment(
    session: Session, appt_in: AppointmentCreate, user_id: uuid.UUID
):
    db_item = Appointment.model_validate(appt_in, update={"user_id": user_id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item
