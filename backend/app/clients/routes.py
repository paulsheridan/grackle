import uuid

from typing import Any, Union, Sequence
from datetime import datetime

from fastapi import APIRouter, HTTPException
from sqlalchemy import select, update, delete
from psycopg.errors import ForeignKeyViolation

from app.clients.models import (
    Client,
    ClientCreate,
    ClientsOut,
    ClientRegister,
    ClientOut,
    ClientUpdate,
)

from app.deps import SessionDep

from app.core.models import Message
from app.deps import CurrentUser
from app.repositories.postgres import PostgresRepo


router = APIRouter()


@router.get("/", response_model=ClientsOut)
def list_clients(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> ClientsOut:
    repo = PostgresRepo(session, Client)
    clients = repo.list("user_id", current_user.id, skip, limit)
    return ClientsOut(data=clients)  # type: ignore


@router.get("/{client_id}", response_model=ClientOut)
def get_client(
    session: SessionDep, current_user: CurrentUser, client_id: uuid.UUID
) -> Any:
    repo = PostgresRepo(session, Client)
    client = repo.read(client_id)

    if not client:
        raise HTTPException(status_code=404, detail="Not found")
    if not current_user.is_superuser and (client.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")
    return client


@router.post("/", response_model=ClientOut)
def create_client(
    session: SessionDep, current_user: CurrentUser, client_in: ClientRegister
) -> Any:
    repo = PostgresRepo(session, Client)

    client_create = ClientCreate(**client_in.model_dump(), user_id=current_user.id)
    client = repo.create(client_create.model_dump())
    return client


@router.patch("/{client_id}", response_model=ClientOut)
def update_client(
    session: SessionDep,
    current_user: CurrentUser,
    client_id: uuid.UUID,
    client_in: ClientUpdate,
) -> Any:
    repo = PostgresRepo(session, Client)
    client = repo.read(client_id)

    if not client:
        raise HTTPException(status_code=404, detail="Not Found")
    if not current_user.is_superuser and (client.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")

    update_dict = client_in.model_dump(exclude_none=True)
    updated = repo.update(client_id, update_dict)
    return updated


@router.delete("/{client_id}")
def delete_client(
    session: SessionDep, current_user: CurrentUser, client_id: uuid.UUID
) -> Message:
    repo = PostgresRepo(session, Client)
    client = repo.read(client_id)

    if not client:
        raise HTTPException(status_code=404, detail="Not Found")
    if not current_user.is_superuser and (client.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")

    repo.delete(client_id)
    return Message(message="Client deleted successfully")
