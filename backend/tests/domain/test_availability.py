import pytest
import datetime
import uuid
import json

from freezegun import freeze_time
from app.services.models import Service, WorkingHours
from app.appointments.models import Appointment

from app.services.domain import (
    calculate_availability,
    calculate_service_date_range,
    availability_per_day,
)
from app.appointments.domain import list_appts_between_dates


@pytest.fixture
def test_service_long():
    svc_data = {
        "id": "2dac127d-13e8-461e-aa6f-eed91d8e2fb6",
        "user_id": "2dac127d-13e8-461e-aa6f-eed91d8e2fb5",
        "service_id": "99c3fe67-a0f3-4e82-9b7d-ade93407aa29",
        "name": "Tattoo Consult",
        "active": False,
        "duration": 30,
        "max_per_day": 2,
        "start": datetime.date(2024, 4, 1),
        "end": datetime.date(2024, 7, 28),
        "workinghours": [
            {"weekday": 0, "open": datetime.time(9, 0), "close": datetime.time(16, 0)},
            {"weekday": 2, "open": datetime.time(9, 0), "close": datetime.time(16, 0)},
            {"weekday": 4, "open": datetime.time(9, 0), "close": datetime.time(16, 0)},
            {"weekday": 5, "open": datetime.time(9, 0), "close": datetime.time(14, 0)},
        ],
    }
    svc = Service.model_validate(svc_data)
    for hour in svc_data["workinghours"]:
        svc.workinghours.append(WorkingHours.model_validate(hour))
    return svc


@pytest.fixture
def test_service_short():
    svc_data = {
        "user_id": "2dac127d-13e8-461e-aa6f-eed91d8e2fb5",
        "service_id": "99c3fe67-a0f3-4e82-9b7d-ade93407aa29",
        "name": "Tattoo Consult",
        "active": False,
        "duration": 30,
        "max_per_day": 2,
        "start": datetime.date(2024, 5, 12),
        "end": datetime.date(2024, 5, 21),
        "workinghours": [
            {"weekday": 0, "open": datetime.time(9, 0), "close": datetime.time(16, 0)},
            {"weekday": 2, "open": datetime.time(9, 0), "close": datetime.time(16, 0)},
            {"weekday": 4, "open": datetime.time(9, 0), "close": datetime.time(16, 0)},
            {"weekday": 5, "open": datetime.time(9, 0), "close": datetime.time(14, 0)},
        ],
    }
    svc = Service.model_validate(svc_data)
    for hour in svc_data["workinghours"]:
        svc.workinghours.append(WorkingHours.model_validate(hour))
    return svc


@pytest.fixture
def test_service_short_april_2024():
    svc_data = {
        "user_id": "2dac127d-13e8-461e-aa6f-eed91d8e2fb5",
        "service_id": "99c3fe67-a0f3-4e82-9b7d-ade93407aa29",
        "name": "Tattoo Consult",
        "active": False,
        "duration": 30,
        "max_per_day": 2,
        "start": datetime.date(2024, 4, 16),
        "end": datetime.date(2024, 4, 21),
        "workinghours": [
            {"weekday": 0, "open": datetime.time(9, 0), "close": datetime.time(16, 0)},
            {"weekday": 2, "open": datetime.time(9, 0), "close": datetime.time(16, 0)},
            {"weekday": 3, "open": datetime.time(13, 0), "close": datetime.time(15, 0)},
            {"weekday": 4, "open": datetime.time(9, 0), "close": datetime.time(16, 0)},
            {"weekday": 5, "open": datetime.time(9, 0), "close": datetime.time(14, 0)},
        ],
    }
    svc = Service.model_validate(svc_data)
    for hour in svc_data["workinghours"]:
        svc.workinghours.append(WorkingHours.model_validate(hour))
    return svc


@pytest.fixture
def test_service_short_hrs():
    svc_data = {
        "user_id": "2dac127d-13e8-461e-aa6f-eed91d8e2fb5",
        "service_id": "99c3fe67-a0f3-4e82-9b7d-ade93407aa29",
        "name": "Tattoo Consult",
        "active": False,
        "duration": 30,
        "max_per_day": 2,
        "start": datetime.date(2024, 5, 12),
        "end": datetime.date(2024, 5, 21),
        "workinghours": [
            {"weekday": 0, "open": datetime.time(9, 0), "close": datetime.time(14, 0)},
            {"weekday": 2, "open": datetime.time(9, 0), "close": datetime.time(14, 0)},
            {"weekday": 4, "open": datetime.time(9, 0), "close": datetime.time(14, 0)},
            {"weekday": 5, "open": datetime.time(9, 0), "close": datetime.time(14, 0)},
        ],
    }
    svc = Service.model_validate(svc_data)
    for hour in svc_data["workinghours"]:
        svc.workinghours.append(WorkingHours.model_validate(hour))
    return svc


@pytest.fixture
def test_appointments_a():
    appts = [
        {
            "user_id": "2dac127d-13e8-461e-aa6f-eed91d8e2fb5",
            "client_email": "tattoofiend@email.com",
            "start": datetime.datetime(2024, 4, 8, 11, 15),
            "end": datetime.datetime(2024, 4, 8, 12, 14),
            "confirmed": True,
            "canceled": False,
        },
        {
            "user_id": "2dac127d-13e8-461e-aa6f-eed91d8e2fb5",
            "client_email": "tattoofiend@email.com",
            "start": datetime.datetime(2024, 4, 8, 13, 00),
            "end": datetime.datetime(2024, 4, 8, 13, 59),
            "confirmed": True,
            "canceled": False,
        },
        {
            "user_id": "2dac127d-13e8-461e-aa6f-eed91d8e2fb5",
            "client_email": "tattoofiend@email.com",
            "start": datetime.datetime(2024, 4, 8, 14, 00),
            "end": datetime.datetime(2024, 4, 8, 16, 14),
            "confirmed": True,
            "canceled": False,
        },
    ]
    return [Appointment.model_validate(item) for item in appts]


@pytest.fixture
def test_appointments_april_2024():
    appts = []
    hours = [
        ([7, 15], [8, 14]),
        ([9, 15], [11, 14]),
        ([11, 15], [12, 14]),
        ([12, 30], [12, 59]),
        ([14, 00], [14, 59]),
    ]
    for day in range(1, 30):
        for time in hours:
            appt = {
                "user_id": "2dac127d-13e8-461e-aa6f-eed91d8e2fb5",
                "client_email": "tattoofiend@email.com",
                "start": datetime.datetime(2024, 4, day, time[0][0], time[0][1]),
                "end": datetime.datetime(2024, 4, day, time[1][0], time[1][1]),
                "confirmed": True,
                "canceled": False,
            }
            appts.append(Appointment.model_validate(appt))
    return appts


def test_get_date_window_returns_correct_date_passed(test_service_long):
    service = test_service_long
    earliest, latest = calculate_service_date_range(service, 2024, 6)
    assert earliest == datetime.date(2024, 6, 1)
    assert latest == datetime.date(2024, 6, 30)


def test_get_date_window_returns_correct_start_end_within_month(test_service_short):
    service = test_service_short
    earliest, latest = calculate_service_date_range(service)
    assert earliest == datetime.date(2024, 5, 12)
    assert latest == datetime.date(2024, 5, 21)


def test_get_date_window_after_service_start_date_passed(test_service_long):
    service = test_service_long
    with pytest.raises(IndexError):
        calculate_service_date_range(service, 2025, 6)


def test_get_date_window_before_service_start_date(test_service_long):
    service = test_service_long
    with pytest.raises(IndexError):
        calculate_service_date_range(service, 2023, 6)


def test_get_date_window_just_before_service_start_date(test_service_long):
    service = test_service_long
    with pytest.raises(IndexError):
        calculate_service_date_range(service, 2024, 3)


@freeze_time("2024-03-06")
def test_get_date_window_returns_no_date_passed_returns_full_month(test_service_long):
    service = test_service_long
    earliest, latest = calculate_service_date_range(service)
    assert earliest == datetime.date(2024, 4, 1)
    assert latest == datetime.date(2024, 4, 30)


@freeze_time("2024-04-06")
def test_calc_day_availability_with_only_early_late_appts(test_service_short_hrs):
    service = test_service_short_hrs
    appts = [
        {
            "user_id": "2dac127d-13e8-461e-aa6f-eed91d8e2fb5",
            "client_email": "tattoofiend@email.com",
            "start": datetime.datetime(2024, 4, 8, 6, 15),
            "end": datetime.datetime(2024, 4, 8, 7, 14),
            "confirmed": True,
            "canceled": False,
        },
        {
            "user_id": "2dac127d-13e8-461e-aa6f-eed91d8e2fb5",
            "client_email": "tattoofiend@email.com",
            "start": datetime.datetime(2024, 4, 8, 14, 15),
            "end": datetime.datetime(2024, 4, 8, 16, 14),
            "confirmed": True,
            "canceled": False,
        },
    ]
    test_appts = [Appointment.model_validate(item) for item in appts]
    office_hours = service.get_workinghours(datetime.date(2024, 4, 3).weekday())
    test_avail = availability_per_day(
        datetime.date(2024, 4, 3),
        service.duration,
        test_appts,
        office_hours,
    )
    assert test_avail == {
        "date": datetime.date(2024, 4, 3),
        "windows": [
            {
                "start": datetime.datetime(2024, 4, 3, 9, 0),
                "end": datetime.datetime(2024, 4, 3, 9, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 9, 30),
                "end": datetime.datetime(2024, 4, 3, 9, 59),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 10, 0),
                "end": datetime.datetime(2024, 4, 3, 10, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 10, 30),
                "end": datetime.datetime(2024, 4, 3, 10, 59),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 11, 0),
                "end": datetime.datetime(2024, 4, 3, 11, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 11, 30),
                "end": datetime.datetime(2024, 4, 3, 11, 59),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 12, 0),
                "end": datetime.datetime(2024, 4, 3, 12, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 12, 30),
                "end": datetime.datetime(2024, 4, 3, 12, 59),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 13, 0),
                "end": datetime.datetime(2024, 4, 3, 13, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 13, 30),
                "end": datetime.datetime(2024, 4, 3, 13, 59),
            },
        ],
    }


@freeze_time("2024-04-06")
def test_calc_day_availability_with_existing_appts(test_service_short_hrs):
    service = test_service_short_hrs
    appts = [
        {
            "user_id": "2dac127d-13e8-461e-aa6f-eed91d8e2fb5",
            "client_email": "tattoofiend@email.com",
            "start": datetime.datetime(2024, 4, 8, 6, 15),
            "end": datetime.datetime(2024, 4, 8, 7, 14),
            "confirmed": True,
            "canceled": False,
        },
        {
            "user_id": "2dac127d-13e8-461e-aa6f-eed91d8e2fb5",
            "client_email": "tattoofiend@email.com",
            "start": datetime.datetime(2024, 4, 8, 12, 00),
            "end": datetime.datetime(2024, 4, 8, 12, 59),
            "confirmed": True,
            "canceled": False,
        },
        {
            "user_id": "2dac127d-13e8-461e-aa6f-eed91d8e2fb5",
            "client_email": "tattoofiend@email.com",
            "start": datetime.datetime(2024, 4, 8, 14, 15),
            "end": datetime.datetime(2024, 4, 8, 16, 14),
            "confirmed": True,
            "canceled": False,
        },
    ]
    test_appts = [Appointment.model_validate(item) for item in appts]
    office_hours = service.get_workinghours(datetime.date(2024, 4, 8).weekday())
    test_avail = availability_per_day(
        datetime.datetime(2024, 4, 8),
        service.duration,
        test_appts,
        office_hours,
    )
    assert test_avail == {
        "date": datetime.datetime(2024, 4, 8, 0, 0),
        "windows": [
            {
                "start": datetime.datetime(2024, 4, 8, 9, 0),
                "end": datetime.datetime(2024, 4, 8, 9, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 8, 9, 30),
                "end": datetime.datetime(2024, 4, 8, 9, 59),
            },
            {
                "start": datetime.datetime(2024, 4, 8, 10, 0),
                "end": datetime.datetime(2024, 4, 8, 10, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 8, 10, 30),
                "end": datetime.datetime(2024, 4, 8, 10, 59),
            },
            {
                "start": datetime.datetime(2024, 4, 8, 11, 0),
                "end": datetime.datetime(2024, 4, 8, 11, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 8, 11, 30),
                "end": datetime.datetime(2024, 4, 8, 11, 59),
            },
            {
                "start": datetime.datetime(2024, 4, 8, 13, 0),
                "end": datetime.datetime(2024, 4, 8, 13, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 8, 13, 30),
                "end": datetime.datetime(2024, 4, 8, 13, 59),
            },
        ],
    }


@freeze_time("2024-04-06")
def test_calc_day_availability_with_full_schedule(
    test_service_short_hrs, test_appointments_a
):
    service = test_service_short_hrs
    office_hours = service.get_workinghours(datetime.date(2024, 4, 8).weekday())
    test_appts = test_appointments_a
    test_avail = availability_per_day(
        datetime.date(2024, 4, 8),
        service.duration,
        test_appts,
        office_hours,
    )
    assert test_avail == {
        "date": datetime.date(2024, 4, 8),
        "windows": [
            {
                "start": datetime.datetime(2024, 4, 8, 9, 0),
                "end": datetime.datetime(2024, 4, 8, 9, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 8, 9, 30),
                "end": datetime.datetime(2024, 4, 8, 9, 59),
            },
            {
                "start": datetime.datetime(2024, 4, 8, 10, 0),
                "end": datetime.datetime(2024, 4, 8, 10, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 8, 10, 30),
                "end": datetime.datetime(2024, 4, 8, 10, 59),
            },
            {
                "start": datetime.datetime(2024, 4, 8, 12, 15),
                "end": datetime.datetime(2024, 4, 8, 12, 44),
            },
        ],
    }


@freeze_time("2024-03-06")
def test_calc_day_availability_no_current_appointments(test_service_long):
    service = test_service_long
    office_hours = service.get_workinghours(datetime.date(2024, 4, 3).weekday())
    test_avail = availability_per_day(
        datetime.date(2024, 4, 3), service.duration, [], office_hours
    )
    assert test_avail == {
        "date": datetime.date(2024, 4, 3),
        "windows": [
            {
                "start": datetime.datetime(2024, 4, 3, 9, 0),
                "end": datetime.datetime(2024, 4, 3, 9, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 9, 30),
                "end": datetime.datetime(2024, 4, 3, 9, 59),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 10, 0),
                "end": datetime.datetime(2024, 4, 3, 10, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 10, 30),
                "end": datetime.datetime(2024, 4, 3, 10, 59),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 11, 0),
                "end": datetime.datetime(2024, 4, 3, 11, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 11, 30),
                "end": datetime.datetime(2024, 4, 3, 11, 59),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 12, 0),
                "end": datetime.datetime(2024, 4, 3, 12, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 12, 30),
                "end": datetime.datetime(2024, 4, 3, 12, 59),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 13, 0),
                "end": datetime.datetime(2024, 4, 3, 13, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 13, 30),
                "end": datetime.datetime(2024, 4, 3, 13, 59),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 14, 0),
                "end": datetime.datetime(2024, 4, 3, 14, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 14, 30),
                "end": datetime.datetime(2024, 4, 3, 14, 59),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 15, 0),
                "end": datetime.datetime(2024, 4, 3, 15, 29),
            },
            {
                "start": datetime.datetime(2024, 4, 3, 15, 30),
                "end": datetime.datetime(2024, 4, 3, 15, 59),
            },
        ],
    }


@freeze_time("2024-03-01")
def test_get_availability_returns_entire_month_if_called_on_first(
    test_service_long, test_appointments_april_2024
):
    earliest, latest = calculate_service_date_range(test_service_long, 2024, 4)
    available_times = calculate_availability(
        earliest, latest, test_service_long, test_appointments_april_2024
    )
    days_in_office = [0, 2, 4, 5]
    assert len(available_times) == 30
    for day in available_times:
        if day["windows"]:
            assert day["date"].weekday() in days_in_office
        else:
            assert not day["date"].weekday() in days_in_office


@freeze_time("2024-03-06")
def test_get_availability_raises_index_error_outside_service_time(
    test_service_short, test_appointments_april_2024
):
    with pytest.raises(IndexError):
        earliest, latest = calculate_service_date_range(test_service_short, 2024, 4)


@freeze_time("2024-03-06")
def test_get_availability_returns_correct_office_days(
    test_service_short_april_2024, test_appointments_april_2024
):
    earliest, latest = calculate_service_date_range(
        test_service_short_april_2024, 2024, 4
    )
    available_times = calculate_availability(
        earliest, latest, test_service_short_april_2024, test_appointments_april_2024
    )
    days_in_office = [0, 2, 3, 4, 5]
    assert len(available_times) == 6
    for day in available_times:
        if day["windows"]:
            assert day["date"].weekday() in days_in_office
        else:
            assert not day["date"].weekday() in days_in_office
