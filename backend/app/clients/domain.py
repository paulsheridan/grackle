import uuid
from typing import Type, Sequence, Any, List
from datetime import datetime, date

from sqlmodel import Session, col, delete, func, select

from app.deps import SessionDep
from app.clients.models import Client


def create_client(session: SessionDep, client_in, user_id):
    db_item = Client.model_validate(client_in, update={"user_id": user_id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


def get_client_by_email(session: SessionDep, email):
    statement = select(Client).where(Client.email == email)
    return session.exec(statement).first()
