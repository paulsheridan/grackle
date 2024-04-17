import calendar
import uuid

from datetime import date, datetime, timedelta
from typing import Optional, List, Sequence
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app import models, schemas
from app.repositories.postgres import PostgresRepo


def calculate_service_date_range(
    self, year: int | None = None, month: int | None = None
) -> tuple[date, date]:
    earliest: date = max(date.today(), self.service.start.date())
    if not month or not year:
        latest: date = min(
            date(
                earliest.year,
                earliest.month,
                calendar.monthrange(earliest.year, earliest.month)[-1],
            ),
            self.service.end.date(),
        )
        return earliest, latest

    if (
        month < earliest.month
        or year < earliest.year
        or month > self.service.end.month
        or year > self.service.end.year
    ):
        raise IndexError
    earliest = max(earliest, date(year, month, 1))
    latest = min(
        date(year, month, calendar.monthrange(year, month)[-1]),
        self.service.end.date(),
    )
    return earliest, latest


def create_availability(
    earliest: date,
    latest: date,
    service: models.Service,
    current_appts: Sequence[models.Appointment],
) -> list[schemas.Availability]:

    available_times = []

    cal = calendar.Calendar()
    for day in cal.itermonthdates(earliest.year, earliest.month):
        if day < earliest or day > latest:
            # TODO: Do more here than just continue. Create empty so that the calendar has something to render
            continue

        office_hours = service.get_day_schedule(day.weekday())
        if office_hours:
            # TODO: Is there a way to make this a pointer again? That would limit the time complexity
            today_appts = [appt for appt in current_appts if appt.start.date() == day]
            today_slots = availability_per_day(
                day, service.duration, today_appts, office_hours
            )
            if today_slots and len(today_slots.windows) > 0:
                available_times.append(today_slots)

    return available_times


def availability_per_day(
    day: date,
    svc_duration_mins: int,
    appointments: list[models.Appointment],
    office_hours: models.DailySchedule,
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
    return models.Availability(**today_slots)
