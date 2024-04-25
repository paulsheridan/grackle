import uuid

from typing import Any, Union, Sequence
from datetime import datetime

from sqlmodel import select
from fastapi import APIRouter, HTTPException
from psycopg.errors import ForeignKeyViolation
from app.deps import CurrentUser, SessionDep
from app.clients import domain

from app.clients.models import (
    Client,
    ClientCreate,
    ClientsOut,
    ClientRegister,
    ClientOut,
    ClientUpdate,
)

from app.core.models import Message


router = APIRouter()


@router.get("/", response_model=ClientsOut)
def list_clients(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> ClientsOut:
    stmt = select(Client).where(Client.user_id == current_user.id)
    data = session.exec(stmt)
    return ClientsOut(data=data)


@router.get("/{client_id}", response_model=ClientOut)
def get_client(
    session: SessionDep, current_user: CurrentUser, client_id: uuid.UUID
) -> Any:
    client = session.get(Client, client_id)

    if not client:
        raise HTTPException(status_code=404, detail="Not found")
    if not current_user.is_superuser and (client.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")
    return client


@router.post("/", response_model=ClientOut)
def create_client(
    session: SessionDep, current_user: CurrentUser, client_in: ClientRegister
) -> Any:
    return domain.create_client(session, client_in, current_user.id)


@router.patch("/{client_id}", response_model=ClientOut)
def update_client(
    session: SessionDep,
    current_user: CurrentUser,
    client_id: uuid.UUID,
    client_in: ClientUpdate,
) -> Any:
    client = session.get(Client, client_id)

    if not client:
        raise HTTPException(status_code=404, detail="Not Found")
    if not current_user.is_superuser and (client.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not authorized")

    update_dict = client_in.model_dump(exclude_unset=True)
    client.sqlmodel_update(update_dict)
    session.add(client)
    session.commit()
    session.refresh(client)
    return client


@router.delete("/{client_id}")
def delete_client(
    session: SessionDep, current_user: CurrentUser, client_id: uuid.UUID
) -> Message:
    client = session.get(Client, client_id)

    if not client:
        raise HTTPException(status_code=404, detail="Not Found")
    if not current_user.is_superuser and (client.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")

    session.delete(client)
    session.commit()
    return Message(message="Client deleted successfully")
