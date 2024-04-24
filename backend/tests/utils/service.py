import random
from datetime import datetime, timedelta, time, date

from sqlmodel import Session

from app.services.models import Service, ServiceRegister
from tests.utils.user import create_random_user
from tests.utils.utils import random_lower_string
from app.services.domain import create_service


def create_random_working_hours():
    workinghours = []
    for idx, val in enumerate(range(random.randrange(2, 7))):
        wh = {
            "weekday": idx,
            "open": time(random.randrange(9, 12), 0),
            "close": time(random.randrange(13, 18), 0),
        }
        workinghours.append(wh)
    return workinghours


def create_random_service(db: Session) -> Service:
    duration = [15, 30, 45, 60, 75, 90]
    max_per_day = [1, 2, 3, 4, 5]
    hour = random.randint(10, 19)
    minute = [15, 30, 45]
    start = date(2024, 2, random.randint(1, 28))
    end = start + timedelta(days=random.randint(20, 60))

    user = create_random_user(db)
    owner_id = user.id
    assert owner_id is not None

    name = random_lower_string()
    description = random_lower_string()
    service_in = ServiceRegister(
        name=name,
        active=True,
        duration=random.choice(duration),
        max_per_day=random.choice(max_per_day),
        start=start,
        end=end,
        user_id=user.id,
        workinghours=create_random_working_hours(),
    )
    return create_service(session=db, svc_in=service_in, user_id=user.id)
