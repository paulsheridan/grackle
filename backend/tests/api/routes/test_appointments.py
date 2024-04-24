from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from tests.utils.appointment import create_random_appointment


def test_create_appointment(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {
        "user_id": "9396c892-cd8f-4514-970e-99a90850b0fd",
        "service_id": "e77c8041-236f-427f-8754-10a7b3fca5dc",
        "client_id": "90ede676-bbcd-4862-8b23-ebc1c7d743e8",
        "start": "2024-06-12T06:15",
        "end": "2024-06-12T06:45",
    }
    response = client.post(
        f"{settings.API_V1_STR}/appointments/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["user_id"] == data["user_id"]
    assert content["service_id"] == data["service_id"]
    assert content["client_id"] == data["client_id"]
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
    assert content["user_id"] == appointment.user_id
    assert content["service_id"] == appointment.service_id
    assert content["client_id"] == appointment.client_id
    assert content["start"] == appointment.start
    assert content["end"] == appointment.end


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
    data = {"duration": 120, "name": "Updated Name"}
    response = client.patch(
        f"{settings.API_V1_STR}/appointments/{appointment.id}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["duration"] == data["duration"]
    assert content["name"] == data["name"]


def test_update_appointment_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"duration": 120, "name": "Updated Name"}
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
    data = {"duration": 120, "name": "Updated Name"}
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
