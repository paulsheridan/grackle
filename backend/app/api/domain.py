import calendar

from datetime import date, datetime, timedelta
from collections import namedtuple
from typing import Optional, List
from pydantic import BaseModel

from models import Availability
from models import Appointment, Service, DailySchedule
from database import get_service
from repositories.appointment import fetch_between_dates


def get_daily_schedule(service: Service, to_find: int) -> Optional[DailySchedule]:
    low, high = 0, len(service.schedule) - 1

    while low <= high:
        mid = (high + low) // 2
        if service.schedule[mid].weekday < to_find:
            low = mid + 1
        elif service.schedule[mid].weekday > to_find:
            high = mid - 1
        else:
            return service.schedule[mid]
    return None


def get_availability(
    user_id: str, service_id: str, year_month: int | None = None
) -> list[Availability]:
    available_times: list = []

    service: Service = get_service(user_id, service_id)
    earliest, latest = determine_date_range(service, year_month)
    appointments: list[Appointment] = fetch_between_dates(user_id, earliest, latest)

    cal = calendar.Calendar()
    for day in cal.itermonthdates(earliest.year, earliest.month):
        if day < earliest or day > latest:
            continue
        # TODO: Is there a way to make this a pointer again? That would limit the time complexity
        today_appointments = [appt for appt in appointments if appt.start.date() == day]
        today_slots = calc_day_availability(service, today_appointments, day)

        if today_slots and len(today_slots.windows) > 0:
            available_times.append(today_slots)

    return available_times


def determine_date_range(
    service: Service, year_month: int | None = None
) -> tuple[date, date]:
    earliest: date = max(date.today(), service.start.date())
    if not year_month:
        latest: date = min(
            date(
                earliest.year,
                earliest.month,
                calendar.monthrange(earliest.year, earliest.month)[-1],
            ),
            service.end.date(),
        )
        return earliest, latest

    year = int(str(year_month)[:4])
    month = abs(year_month % 100)
    if (
        month < earliest.month
        or year < earliest.year
        or month > service.end.month
        or year > service.end.year
    ):
        raise IndexError
    earliest = max(earliest, date(year, month, 1))
    latest = min(
        date(year, month, calendar.monthrange(year, month)[-1]), service.end.date()
    )
    return earliest, latest


def calc_day_availability(service: Service, appointments: list[Appointment], day: date):
    office_hours = service.get_daily_schedule(day.weekday())
    if not office_hours:
        return None

    appt_index = 0
    today_slots: dict = {"date": day, "windows": []}
    window_start = datetime.combine(day, office_hours.open)
    window_end = (
        window_start + timedelta(minutes=service.duration) - timedelta(minutes=1)
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
            window_start + timedelta(minutes=service.duration) - timedelta(minutes=1)
        )
    return Availability(**today_slots)
