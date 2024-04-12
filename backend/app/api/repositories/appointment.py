from datetime import datetime
from typing import Any, List, Tuple

from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, inspect

from app.api.models import Appointment
from app.api.schemas import AppointmentCreate, AppointmentOut
from app.api.repositories.db_service import PostgresService


def create_pending(session: Session, appt_create: AppointmentCreate) -> Appointment:
    db_service = PostgresService(session, Appointment)

    existing_appt = db_service.read_by("start", appt_create.start)
    if existing_appt:
        raise HTTPException(status_code=409, detail="Appointment time already booked.")

    new_appt = Appointment(
        **appt_create.model_dump(),
    )
    session.add(new_appt)
    session.commit()
    session.refresh(new_appt)
    return new_appt
