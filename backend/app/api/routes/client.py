import uuid

from typing import Any, Union, Sequence
from datetime import datetime

from fastapi import APIRouter, HTTPException
from sqlalchemy import select, update, delete
from psycopg.errors import ForeignKeyViolation

from app.api import schemas
from app.api import models
from app.api.deps import CurrentUser, SessionDep
from app.api.repositories.postgres import PostgresRepo


router = APIRouter()


@router.get("/", response_model=schemas.ClientsOut)
def list_clients(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> schemas.ClientsOut:
    repo = PostgresRepo(session, models.Client)
    clients = repo.list("user_id", current_user.id, skip, limit)
    return schemas.ClientsOut(data=clients)  # type: ignore


@router.get("/{client_id}", response_model=schemas.ClientOut)
def get_client(
    session: SessionDep, current_user: CurrentUser, client_id: uuid.UUID
) -> Any:
    repo = PostgresRepo(session, models.Client)
    client = repo.read(client_id)

    if not client:
        raise HTTPException(status_code=404, detail="Not found")
    if not current_user.is_superuser and (client.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")
    return client


@router.post("/", response_model=schemas.ClientOut)
def create_client(
    session: SessionDep, current_user: CurrentUser, client_in: schemas.ClientRegister
) -> Any:
    repo = PostgresRepo(session, models.Client)

    client_create = schemas.ClientCreate(
        **client_in.model_dump(), user_id=current_user.id
    )
    client = repo.create(client_create.model_dump())
    return client


@router.patch("/{client_id}", response_model=schemas.ClientOut)
def update_client(
    session: SessionDep,
    current_user: CurrentUser,
    client_id: uuid.UUID,
    client_in: schemas.ClientUpdate,
) -> Any:
    repo = PostgresRepo(session, models.Client)
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
) -> schemas.Message:
    repo = PostgresRepo(session, models.Client)
    client = repo.read(client_id)

    if not client:
        raise HTTPException(status_code=404, detail="Not Found")
    if not current_user.is_superuser and (client.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")

    repo.delete(client_id)
    return schemas.Message(message="Client deleted successfully")
