from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from tests.utils.appointment import create_random_appointment
from tests.utils.client import create_random_client
from tests.utils.user import create_random_user
from tests.utils.service import create_random_service


def test_create_appointment(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    customer = create_random_client(db)
    service = create_random_service(db)
    user = create_random_user(db)
    data = {
        "user_id": str(user.id),
        "service_id": str(service.id),
        "client_id": str(customer.id),
        "start": "2024-06-12T06:15:00",
        "end": "2024-06-12T06:45:00",
    }
    response = client.post(
        f"{settings.API_V1_STR}/appointments/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["service_id"] == str(service.id)
    assert content["client_id"] == str(customer.id)
    assert content["start"] == data["start"]
    assert content["end"] == data["end"]
    assert "id" in content


def test_read_appointment(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    appointment = create_random_appointment(db)
    response = client.get(
        f"{settings.API_V1_STR}/appointments/{appointment.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["user_id"] == str(appointment.user_id)
    assert content["service_id"] == str(appointment.service_id)
    assert content["client_id"] == str(appointment.client_id)
    assert content["start"] == appointment.start.isoformat(sep="T")
    assert content["end"] == appointment.end.isoformat(sep="T")


def test_read_appointment_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/appointments/90ede676-bbcd-4862-8b23-ebc1c7d743e8",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Not found"


def test_read_appointment_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    appointment = create_random_appointment(db)
    response = client.get(
        f"{settings.API_V1_STR}/appointments/{appointment.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 400
    content = response.json()
    assert content["detail"] == "Not authorized"


def test_read_appointments(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    create_random_appointment(db)
    create_random_appointment(db)
    create_random_appointment(db)
    response = client.get(
        f"{settings.API_V1_STR}/appointments/",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200


def test_update_appointment(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    appointment = create_random_appointment(db)
    data = {"confirmed": False, "canceled": True}
    response = client.patch(
        f"{settings.API_V1_STR}/appointments/{appointment.id}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["confirmed"] == data["confirmed"]
    assert content["canceled"] == data["canceled"]


def test_update_appointment_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"confirmed": False, "canceled": True}
    response = client.patch(
        f"{settings.API_V1_STR}/appointments/90ede676-bbcd-4862-8b23-ebc1c7d743e8",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Not Found"


def test_update_appointment_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    appointment = create_random_appointment(db)
    data = {"confirmed": False, "canceled": True}
    response = client.patch(
        f"{settings.API_V1_STR}/appointments/{appointment.id}",
        headers=normal_user_token_headers,
        json=data,
    )
    assert response.status_code == 400
    content = response.json()
    assert content["detail"] == "Not authorized"


def test_delete_appointment(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    appointment = create_random_appointment(db)
    response = client.delete(
        f"{settings.API_V1_STR}/appointments/{appointment.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["message"] == "Appointment deleted successfully"


def test_delete_appointment_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.delete(
        f"{settings.API_V1_STR}/appointments/90ede676-bbcd-4862-8b23-ebc1c7d743e8",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Not Found"


def test_delete_appointment_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    appointment = create_random_appointment(db)
    response = client.delete(
        f"{settings.API_V1_STR}/appointments/{appointment.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 400
    content = response.json()
    assert content["detail"] == "Not authorized"
