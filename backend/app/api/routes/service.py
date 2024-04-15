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


@router.get("/", response_model=schemas.ServicesOut)
def list_services(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> schemas.ServicesOut:
    repo = PostgresRepo(session, models.Service)
    services = repo.list("user_id", current_user.id, skip, limit)
    return schemas.ServicesOut(data=services)  # type: ignore


@router.get("/{svc_id}", response_model=schemas.ServiceOut)
def get_service(
    session: SessionDep, current_user: CurrentUser, svc_id: uuid.UUID
) -> Any:
    repo = PostgresRepo(session, models.Service)
    service = repo.read(svc_id)

    if not service:
        raise HTTPException(status_code=404, detail="Not found")
    if not current_user.is_superuser and (service.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")
    return service


@router.post("/", response_model=schemas.ServiceOut)
def create_service(
    session: SessionDep, current_user: CurrentUser, svc_in: schemas.ServiceCreate
) -> Any:
    repo = PostgresRepo(session, models.Service)

    existing_in_timeslot = repo.read_by("start", svc_in.start)
    if existing_in_timeslot:
        raise HTTPException(status_code=409, detail="Service time already booked.")

    svc_in.user_id = current_user.id
    repo = PostgresRepo(session, models.Service)
    service = repo.create(svc_in.model_dump())
    return service


@router.patch("/{svc_id}", response_model=schemas.ServiceOut)
def update_service(
    session: SessionDep,
    current_user: CurrentUser,
    svc_id: uuid.UUID,
    service_in: schemas.ServiceUpdate,
) -> Any:
    repo = PostgresRepo(session, models.Service)
    service = repo.read(svc_id)

    if not service:
        raise HTTPException(status_code=404, detail="Not Found")
    if not current_user.is_superuser and (service.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")

    update_dict = service_in.model_dump(exclude_none=True)
    updated = repo.update(svc_id, update_dict)
    return updated


@router.delete("/{svc_id}")
def delete_service(
    session: SessionDep, current_user: CurrentUser, svc_id: uuid.UUID
) -> schemas.Message:
    repo = PostgresRepo(session, models.Service)
    service = repo.read(svc_id)

    if not service:
        raise HTTPException(status_code=404, detail="Not Found")
    if not current_user.is_superuser and (service.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")

    repo.delete(svc_id)
    return schemas.Message(message="Service deleted successfully")
