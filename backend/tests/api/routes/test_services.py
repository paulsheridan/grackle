from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from tests.utils.service import create_random_service


def test_create_service(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {
        "name": "Tattoo Consult",
        "active": False,
        "duration": 30,
        "max_per_day": 2,
        "start": "2024-04-01",
        "end": "2024-07-28",
        "workinghours": [
            {"weekday": 0, "open": "11:00:00", "close": "14:00:00"},
            {"weekday": 2, "open": "11:00:00", "close": "14:00:00"},
            {"weekday": 4, "open": "11:00:00", "close": "14:00:00"},
            {"weekday": 5, "open": "11:00:00", "close": "14:00:00"},
        ],
    }
    response = client.post(
        f"{settings.API_V1_STR}/services/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == data["name"]
    assert content["active"] == data["active"]
    assert content["duration"] == data["duration"]
    assert content["max_per_day"] == data["max_per_day"]
    assert content["start"] == data["start"]
    assert content["end"] == data["end"]
    assert "id" in content
    assert "user_id" in content


def test_read_service(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    service = create_random_service(db)
    response = client.get(
        f"{settings.API_V1_STR}/services/{service.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == service.name
    assert content["active"] == service.active
    assert content["duration"] == service.duration
    assert content["max_per_day"] == service.max_per_day
    assert content["start"] == service.start.strftime("%Y-%m-%d")
    assert content["end"] == service.end.strftime("%Y-%m-%d")


def test_read_service_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/services/90ede676-bbcd-4862-8b23-ebc1c7d743e8",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Not found"


def test_read_service_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    service = create_random_service(db)
    response = client.get(
        f"{settings.API_V1_STR}/services/{service.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 400
    content = response.json()
    assert content["detail"] == "Not authorized"


def test_read_services(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    create_random_service(db)
    create_random_service(db)
    create_random_service(db)
    response = client.get(
        f"{settings.API_V1_STR}/services/",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200


def test_update_service(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    service = create_random_service(db)
    data = {"duration": 120, "name": "Updated Name"}
    response = client.patch(
        f"{settings.API_V1_STR}/services/{service.id}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["duration"] == data["duration"]
    assert content["name"] == data["name"]


def test_update_service_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"duration": 120, "name": "Updated Name"}
    response = client.patch(
        f"{settings.API_V1_STR}/services/90ede676-bbcd-4862-8b23-ebc1c7d743e8",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Not Found"


def test_update_service_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    service = create_random_service(db)
    data = {"duration": 120, "name": "Updated Name"}
    response = client.patch(
        f"{settings.API_V1_STR}/services/{service.id}",
        headers=normal_user_token_headers,
        json=data,
    )
    assert response.status_code == 400
    content = response.json()
    assert content["detail"] == "Not authorized"


def test_delete_service(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    service = create_random_service(db)
    response = client.delete(
        f"{settings.API_V1_STR}/services/{service.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["message"] == "Service deleted successfully"


def test_delete_service_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.delete(
        f"{settings.API_V1_STR}/services/90ede676-bbcd-4862-8b23-ebc1c7d743e8",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Not Found"


def test_delete_service_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    service = create_random_service(db)
    response = client.delete(
        f"{settings.API_V1_STR}/services/{service.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 400
    content = response.json()
    assert content["detail"] == "Not authorized"
