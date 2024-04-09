from typing import Any, List, Tuple
from datetime import datetime

from app.core.security import get_password_hash

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api.models import Appointment
from app.api.schemas import AppointmentCreate, AppointmentUpdate
from app.core.security import verify_password


def create(session: Session, appointment_create: AppointmentCreate):
    db_appointment = Appointment(**appointment_create.model_dump())
    session.add(db_appointment)
    session.commit()
    return db_appointment


def fetch_by_id(session: Session, _id):
    stmt = select(Appointment).where(Appointment.id == _id)
    return session.execute(stmt)


def fetch_between_dates(session: Session, start: datetime, end: datetime):
    stmt = select(Appointment).where(Appointment.start.between(start, end))
    return session.execute(stmt)


def fetch_all(session: Session, skip: int = 0, limit: int = 100):
    stmt = select(Appointment).offset(skip).limit(limit)
    return session.execute(stmt)


def delete(session: Session, appointment_id: int):
    stmt = (
        delete(Appointment)  # type: ignore
        .where(Appointment.id == appointment_id)
        .returning(Appointment.id)
    )
    return session.execute(stmt)


def update(session: Session, appointment_id: int, appointment_data: dict):
    stmt = (
        update(Appointment)  # type: ignore
        .where(Appointment.id == appointment_id)
        .values(appointment_data)
        .returning(Appointment)
    )
    return session.execute(stmt)
