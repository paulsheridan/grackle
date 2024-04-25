from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from tests.utils.client import create_random_client


def test_create_client(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {
        "email": "clark.clientford@email.com",
        "first_name": "Clark",
        "last_name": "Clientford",
        "pronouns": "they-them",
        "birthday": "1988-12-04",
        "preferred_contact": "email",
        "phone_number": "123-456-9999",
    }
    response = client.post(
        f"{settings.API_V1_STR}/clients/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["email"] == data["email"]
    assert content["first_name"] == data["first_name"]
    assert content["last_name"] == data["last_name"]
    assert content["pronouns"] == data["pronouns"]
    assert content["birthday"] == data["birthday"]
    assert content["preferred_contact"] == data["preferred_contact"]
    assert content["phone_number"] == data["phone_number"]
    assert "id" in content


def test_read_client(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    customer = create_random_client(db)
    response = client.get(
        f"{settings.API_V1_STR}/clients/{customer.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["email"] == customer.email
    assert content["first_name"] == customer.first_name
    assert content["last_name"] == customer.last_name
    assert content["pronouns"] == customer.pronouns
    assert content["birthday"] == customer.birthday.strftime("%Y-%m-%d")
    assert content["preferred_contact"] == customer.preferred_contact
    assert content["phone_number"] == customer.phone_number


def test_read_client_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/clients/90ede676-bbcd-4862-8b23-ebc1c7d743e8",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Not found"


def test_read_client_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    customer = create_random_client(db)
    response = client.get(
        f"{settings.API_V1_STR}/clients/{customer.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 400
    content = response.json()
    assert content["detail"] == "Not authorized"


def test_read_clients(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    create_random_client(db)
    create_random_client(db)
    create_random_client(db)
    response = client.get(
        f"{settings.API_V1_STR}/clients/",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200


def test_update_client(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    customer = create_random_client(db)
    data = {"email": "newemail@email.com", "first_name": "Updated"}
    response = client.patch(
        f"{settings.API_V1_STR}/clients/{customer.id}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["email"] == data["email"]
    assert content["first_name"] == data["first_name"]


def test_update_client_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"email": "newemail@email.com", "fist_name": "Updated"}
    response = client.patch(
        f"{settings.API_V1_STR}/clients/90ede676-bbcd-4862-8b23-ebc1c7d743e8",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Not Found"


def test_update_client_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    customer = create_random_client(db)
    data = {"email": "newemail@email.com", "fist_name": "Updated"}
    response = client.patch(
        f"{settings.API_V1_STR}/clients/{customer.id}",
        headers=normal_user_token_headers,
        json=data,
    )
    assert response.status_code == 400
    content = response.json()
    assert content["detail"] == "Not authorized"


def test_delete_client(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    customer = create_random_client(db)
    response = client.delete(
        f"{settings.API_V1_STR}/clients/{customer.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["message"] == "Client deleted successfully"


def test_delete_client_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.delete(
        f"{settings.API_V1_STR}/clients/90ede676-bbcd-4862-8b23-ebc1c7d743e8",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Not Found"


def test_delete_client_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    customer = create_random_client(db)
    response = client.delete(
        f"{settings.API_V1_STR}/clients/{customer.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 400
    content = response.json()
    assert content["detail"] == "Not authorized"
