import uuid

from typing import Any, Union, Sequence
from datetime import datetime

from fastapi import APIRouter, HTTPException
from psycopg.errors import ForeignKeyViolation
from sqlmodel import select

from app.deps import CurrentUser, SessionDep
from app.clients.models import Client
from app.services.models import (
    Service,
    ServicePublic,
    ServicesPublic,
    WorkingHours,
    ServiceCreate,
    ServiceUpdate,
    Availabilities,
)
from app.users.models import User
from app.appointments.models import Appointment
from app.core.models import Message
from app.appointments.domain import list_appts_between_dates
from app.services.domain import (
    availability_per_day,
    calculate_service_date_range,
    calculate_availability,
)


router = APIRouter()


@router.get("/", response_model=ServicesPublic)
def list_services(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> ServicesPublic:
    stmt = select(Service).where(Service.user_id == current_user.id)
    data = session.exec(stmt)
    return ServicesPublic(data=data)


@router.get("/{svc_id}", response_model=ServicePublic)
def get_service(
    session: SessionDep, current_user: CurrentUser, svc_id: uuid.UUID
) -> Any:
    service = session.get(Service, svc_id)
    if not service:
        raise HTTPException(status_code=404, detail="Not found")
    if not current_user.is_superuser and (service.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not authorized")
    return service


@router.post("/", response_model=ServicePublic)
def create_service(
    session: SessionDep, current_user: CurrentUser, svc_in: ServiceCreate
) -> Any:
    db_item = Service.model_validate(svc_in, update={"user_id": current_user.id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


@router.patch("/{svc_id}", response_model=ServicePublic)
def update_service(
    session: SessionDep,
    current_user: CurrentUser,
    svc_id: uuid.UUID,
    service_in: ServiceUpdate,
) -> Any:
    service = session.get(Service, svc_id)

    if not service:
        raise HTTPException(status_code=404, detail="Not Found")
    if not current_user.is_superuser and (service.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not authorized")

    update_dict = service_in.model_dump(exclude_unset=True)
    service.sqlmodel_update(update_dict)
    session.add(service)
    session.commit()
    session.refresh(service)
    return service


@router.delete("/{svc_id}")
def delete_service(
    session: SessionDep, current_user: CurrentUser, svc_id: uuid.UUID
) -> Message:
    service = session.get(Service, svc_id)

    if not service:
        raise HTTPException(status_code=404, detail="Not Found")
    if not current_user.is_superuser and (service.user_id != current_user.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Not authorized")

    session.delete(service)
    # TODO: Delete associated time objects
    session.commit()
    return Message(message="Service deleted successfully")


@router.get("/available/{user_id}", response_model=ServicesPublic)
def list_available_services(
    session: SessionDep,
    user_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100,
) -> ServicesPublic:
    stmt = (
        select(Service).where(Service.user_id == user_id).where(Service.active == True)
    )
    data = session.exec(stmt)
    return ServicesPublic(data=data)


@router.get("/{svc_id}/availability")
def get_service_availability(
    session: SessionDep,
    svc_id: uuid.UUID,
    year: int | None = None,
    month: int | None = None,
) -> Availabilities:
    stmt = select(Service).join(WorkingHours).where(Service.id == svc_id)
    service = session.exec(stmt).first()

    if service is None:
        raise HTTPException(status_code=404, detail="Not Found")

    try:
        earliest, latest = calculate_service_date_range(service, year, month)
    except IndexError:
        return Availabilities(data=[])
    current_appts = list_appts_between_dates(session, service.user_id, earliest, latest)
    availability = calculate_availability(earliest, latest, service, current_appts)
    return Availabilities(data=availability)
