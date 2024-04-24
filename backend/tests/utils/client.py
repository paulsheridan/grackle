import random
import uuid

from datetime import datetime, timedelta, time, date
from sqlmodel import Session

from app.clients.models import Client, ClientCreate
from tests.utils.user import create_random_user
from tests.utils.utils import random_email, random_lower_string, random_phone_number
from app.clients.domain import create_client


def create_random_client(db: Session) -> Client:
    first_name = random_lower_string()
    last_name = random_lower_string()
    pronouns = random.choice(["he/him", "they/them", "she/her"])
    preferred_contact = random.choice(["email", "phone"])
    birthday = date(
        random.randint(1971, 2001), random.randint(1, 12), random.randint(1, 28)
    )
    email = random_email()
    phone_number = random_phone_number()

    user = create_random_user(db)
    owner_id = user.id
    assert owner_id is not None

    name = random_lower_string()
    description = random_lower_string()
    client_in = ClientCreate(
        email=email,
        first_name=first_name,
        last_name=last_name,
        pronouns=pronouns,
        birthday=birthday,
        preferred_contact=random.choice(preferred_contact),
        phone_number=phone_number,
    )
    return create_client(session=db, client_in=client_in, user_id=owner_id)
