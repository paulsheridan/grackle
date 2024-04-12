from datetime import datetime
from typing import Any, List, Tuple


from sqlalchemy.orm import Session
from sqlalchemy import select, inspect, update

from app.api.models import Client
from app.api.schemas import ClientCreate, ClientOut


def create_or_update(session: Session, client_create: ClientCreate) -> ClientOut:
    existing = session.execute(
        select(Client).where(Client.email == client_create.email)
    ).one_or_none()

    if existing is None:
        new_client = Client(
            **client_create.model_dump(),
        )
        session.add(new_client)
        session.commit()
        session.refresh(new_client)
        return new_client

    update_dict = client_create.model_dump(exclude_unset=True)
    stmt = update(Client).where(Client.id == id).values(update_dict).returning(Client)
    return session.execute(stmt)
