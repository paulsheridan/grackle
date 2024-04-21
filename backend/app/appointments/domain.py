import uuid
from typing import Type, Sequence, Any, List
from datetime import datetime, date

from sqlmodel import Session, col, delete, func, select

from app.deps import SessionDep
from app.appointments.models import Appointment


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
) -> Appointment:
    pass
