import uuid

from typing import Any, Union, Sequence
from datetime import datetime

from fastapi import APIRouter, HTTPException
from psycopg.errors import ForeignKeyViolation
from sqlmodel import select

# from app.repositories.postgres import PostgresRepo
from app.deps import CurrentUser
from app.clients.models import Client
from app.services.models import (
    Service,
    ServiceOut,
    ServicesOut,
    WorkingHours,
    WorkingHoursCreate,
    ServiceCreate,
    ServiceRegister,
    ServiceUpdate,
)
from app.users.models import User
from app.appointments.models import Appointment
from app.core.models import Message
from app.services.domain import (
    availability_per_day,
    calculate_service_date_range,
    create_availability,
)
from app.deps import SessionDep


router = APIRouter()


@router.get("/", response_model=ServicesOut)
def list_services(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> ServicesOut:
    stmt = select(Service)
    data = session.exec(stmt)
    return ServicesOut(data=services)  # type: ignore


@router.get("/{svc_id}", response_model=ServiceOut)
def get_service(
    session: SessionDep, current_user: CurrentUser, svc_id: uuid.UUID
) -> Any:
    repo = PostgresRepo(session, Service)
    service = repo.read(svc_id)

    if not service:
        raise HTTPException(status_code=404, detail="Not found")
    if not current_user.is_superuser and (service.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")
    return service


@router.post("/", response_model=ServiceOut)
def create_service(
    session: SessionDep, current_user: CurrentUser, svc_in: ServiceRegister
) -> Any:
    repo = PostgresRepo(session, Service)

    service_create = ServiceCreate(**svc_in.model_dump(), user_id=current_user.id)
    service = repo.create_joined(
        WorkingHours,
        service_create.model_dump(),
        svc_in.workinghours,
        "workinghours",
    )
    repo = PostgresRepo(session, WorkingHours)

    return service


@router.patch("/{svc_id}", response_model=ServiceOut)
def update_service(
    session: SessionDep,
    current_user: CurrentUser,
    svc_id: uuid.UUID,
    service_in: ServiceUpdate,
) -> Any:
    repo = PostgresRepo(session, Service)
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
) -> Message:
    repo = PostgresRepo(session, Service)
    service = repo.read(svc_id)

    if not service:
        raise HTTPException(status_code=404, detail="Not Found")
    if not current_user.is_superuser and (service.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")

    repo.delete(svc_id)
    return Message(message="Service deleted successfully")


@router.get("/{svc_id}/availability")
def get_service_availability(
    session: SessionDep,
    svc_id: uuid.UUID,
    year: int | None = None,
    month: int | None = None,
):
    svc_repo = PostgresRepo(session, Service)
    service = svc_repo.read_with_join("workinghours", "id", svc_id)
    print(service.__dict__)

    earliest, latest = calculate_service_date_range(service, year, month)

    appts_repo = PostgresRepo(session, Appointment)
    current_appts = appts_repo.list_between_dates(
        "user_id", service.user_id, earliest, latest
    )

    availability = create_availability(earliest, latest, service, current_appts)
    return availability
