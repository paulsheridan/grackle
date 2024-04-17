import uuid

from typing import Any, Union, Sequence
from datetime import datetime

from fastapi import APIRouter, HTTPException
from sqlalchemy import select, update, delete
from psycopg.errors import ForeignKeyViolation

from app import schemas, models
from app.api.deps import CurrentUser, SessionDep
from app.repositories.postgres import PostgresRepo
from app.domain.availability import (
    availability_per_day,
    calculate_service_date_range,
    create_availability,
)


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
    session: SessionDep, current_user: CurrentUser, svc_in: schemas.ServiceRegister
) -> Any:
    repo = PostgresRepo(session, models.Service)

    service_create = schemas.ServiceCreate(
        **svc_in.model_dump(), user_id=current_user.id
    )
    service = repo.create(service_create.model_dump())
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


@router.get("/{svc_id}/availability")
def get_service_availability(
    session: SessionDep,
    svc_id: uuid.UUID,
    year: int | None = None,
    month: int | None = None,
):
    svc_repo = PostgresRepo(session, models.Service)
    service = svc_repo.read_by("id", svc_id)

    earliest, latest = calculate_service_date_range(service, year, month)

    appts_repo = PostgresRepo(session, models.Appointment)
    current_appts = appts_repo.list_between_dates(
        "user_id", service.user_id, earliest, latest
    )

    availability = create_availability(earliest, latest, service, current_appts)
    return availability
