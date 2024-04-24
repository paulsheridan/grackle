import random
import uuid

from datetime import datetime, timedelta, time, date
from sqlmodel import Session

from app.appointments.models import Appointment, AppointmentCreate
from tests.utils.utils import random_lower_string
from app.appointments.domain import create_appointment
from tests.utils.client import create_random_client
from tests.utils.user import create_random_user
from tests.utils.service import create_random_service


def create_random_appointment(db: Session) -> Appointment:
    customer = create_random_client(db)
    service = create_random_service(db)
    user = create_random_user(db)

    duration = [15, 30, 45, 60, 75, 90]
    max_per_day = [1, 2, 3, 4, 5]
    hour = random.randint(10, 19)
    minute = [15, 30, 45]
    appt_start = datetime(
        2024,
        2,
        random.randint(1, 28),
        random.randint(9, 18),
        random.choice([0, 15, 30, 45]),
    )
    appt_end = appt_start + timedelta(days=random.choice(duration))
    owner_id = user.id
    assert owner_id is not None

    name = random_lower_string()
    description = random_lower_string()
    appointment_in = AppointmentCreate(
        user_id=user.id,
        client_id=customer.id,
        service_id=service.id,
        start=appt_start,
        end=appt_end,
        confirmed=True,
        canceled=False,
    )
    return create_appointment(session=db, appt_in=appointment_in, user_id=user.id)
