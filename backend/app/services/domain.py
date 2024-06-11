import calendar
import uuid

from datetime import date, datetime, timedelta
from typing import Optional, List, Sequence
from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlmodel import select

from app.services.models import Availabilities
from app.clients.models import Client
from app.services.models import Service, WorkingHours, Availability, ServiceCreate
from app.users.models import User
from app.appointments.models import Appointment
from app.core.models import Message
from app.deps import CurrentUser, SessionDep
from app.appointments.domain import list_appts_between_dates


def create_service(
    *, session: Session, svc_in: ServiceCreate, user_id: uuid.UUID
) -> Service:
    db_item = Service.model_validate(svc_in, update={"user_id": user_id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


# def get_service_availability(
#     session: SessionDep,
#     svc_id: uuid.UUID,
#     year: int | None = None,
#     month: int | None = None,
# ) -> Availabilities | None:
#     stmt = select(Service).join(WorkingHours).where(Service.id == svc_id)
#     service = session.exec(stmt).first()

#     if service is None:
#         return None

#     earliest, latest = calculate_service_date_range(service, year, month)
#     current_appts = list_appts_between_dates(session, service.user_id, earliest, latest)
#     availability = calculate_availability(earliest, latest, service, current_appts)
#     return Availabilities(data=availability)


def calculate_service_date_range(
    service: Service, year: int | None = None, month: int | None = None
) -> tuple[date, date]:
    earliest: date = max(date.today(), service.start)
    if not month or not year:
        latest: date = min(
            date(
                earliest.year,
                earliest.month,
                calendar.monthrange(earliest.year, earliest.month)[-1],
            ),
            service.end,
        )
        return earliest, latest

    if (
        month < earliest.month
        or year < earliest.year
        or (year > service.end.year and month > service.end.month)
    ):
        raise IndexError
    earliest = max(earliest, date(year, month, 1))
    latest = min(
        date(year, month, calendar.monthrange(year, month)[-1]),
        service.end,
    )
    return earliest, latest


def calculate_availability(
    earliest: date,
    latest: date,
    service: Service,
    current_appts: Sequence[Appointment],
) -> list[Availability]:

    output_calendar = []

    cal = calendar.Calendar()
    for day in cal.itermonthdates(earliest.year, earliest.month):
        if day < earliest or day > latest:
            continue
        office_hours = service.get_workinghours(day.weekday())
        if office_hours:
            today_appts = [appt for appt in current_appts if appt.start.date() == day]
            today_slots = availability_per_day(
                day, service.duration, today_appts, office_hours
            )

            if len(today_slots["windows"]) > 0:
                output_calendar.append(today_slots)

    return output_calendar


def availability_per_day(
    day: date,
    svc_duration_mins: int,
    appointments: list[Appointment],
    office_hours: WorkingHours,
):
    appt_index = 0
    today_slots: dict = {"date": day, "windows": []}
    window_start = datetime.combine(day, office_hours.open)
    window_end = (
        window_start + timedelta(minutes=svc_duration_mins) - timedelta(minutes=1)
    )

    while window_end < datetime.combine(day, office_hours.close):
        if not appointments or appt_index >= len(appointments):
            today_slots["windows"].append({"start": window_start, "end": window_end})
            window_start = window_end + timedelta(minutes=1)
        else:
            if window_end < appointments[appt_index].start:
                today_slots["windows"].append(
                    {"start": window_start, "end": window_end}
                )
                window_start = window_end + timedelta(minutes=1)
            elif appointments[appt_index].end < window_start:
                today_slots["windows"].append(
                    {"start": window_start, "end": window_end}
                )
                window_start = window_end + timedelta(minutes=1)
                appt_index += 1
            else:
                window_start = appointments[appt_index].end + timedelta(minutes=1)
                appt_index += 1
        window_end = (
            window_start + timedelta(minutes=svc_duration_mins) - timedelta(minutes=1)
        )
    return today_slots
