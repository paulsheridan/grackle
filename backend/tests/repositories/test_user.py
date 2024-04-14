from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
import pytest
from unittest.mock import Mock, patch
from sqlalchemy.orm import Session
from uuid import UUID
from app.api.schemas import UserCreate, UserUpdate
from app.api.models import User
from app.core.security import verify_password, get_password_hash
from app.api.repositories.postgres import PostgresRepo
from app.api.domain.user import (
    authenticate,
    create_user,
    update_user,
    get_user_by_email,
)
from app.core.security import verify_password
from app.api.schemas import User, UserCreate, UserUpdate
from tests.utils.utils import random_email, random_lower_string


@pytest.fixture
def mock_session():
    return Mock(spec=Session)


@pytest.fixture
def mock_user():
    return Mock(spec=User)


@pytest.fixture
def mock_user_create():
    return Mock(spec=UserCreate)


@pytest.fixture
def mock_user_update():
    return Mock(spec=UserUpdate)


@pytest.fixture
def mock_repo():
    return Mock(spec=PostgresRepo)


def test_create_user(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    username = random_lower_string()
    full_name = random_lower_string()
    shop_name = random_lower_string()
    user_in = UserCreate(
        email=email,
        password=password,
        username=username,
        full_name=full_name,
        shop_name=shop_name,
    )
    user = crud.create_user(session=db, user_create=user_in)
    assert user.email == email
    assert hasattr(user, "hashed_password")


def test_authenticate_user(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    username = random_lower_string()
    full_name = random_lower_string()
    shop_name = random_lower_string()
    user_in = UserCreate(
        email=email,
        password=password,
        username=username,
        full_name=full_name,
        shop_name=shop_name,
    )
    user = crud.create_user(session=db, user_create=user_in)
    authenticated_user = crud.authenticate(session=db, email=email, password=password)
    assert authenticated_user
    assert user.email == authenticated_user.email


def test_not_authenticate_user(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    user = crud.authenticate(session=db, email=email, password=password)
    assert user is None


def test_check_if_user_is_active(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    username = random_lower_string()
    full_name = random_lower_string()
    shop_name = random_lower_string()
    user_in = UserCreate(
        email=email,
        password=password,
        username=username,
        full_name=full_name,
        shop_name=shop_name,
    )
    user = crud.create_user(session=db, user_create=user_in)
    assert user.is_active is True


def test_check_if_user_is_active_inactive(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    username = random_lower_string()
    full_name = random_lower_string()
    shop_name = random_lower_string()
    user_in = UserCreate(
        email=email,
        password=password,
        username=username,
        full_name=full_name,
        shop_name=shop_name,
        is_active=True,
    )
    user = crud.create_user(session=db, user_create=user_in)
    assert user.is_active


def test_check_if_user_is_superuser(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    username = random_lower_string()
    full_name = random_lower_string()
    shop_name = random_lower_string()
    user_in = UserCreate(
        email=email,
        password=password,
        username=username,
        full_name=full_name,
        shop_name=shop_name,
        is_superuser=True,
    )
    user = crud.create_user(session=db, user_create=user_in)
    assert user.is_superuser is True


def test_check_if_user_is_normal_user(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    username = random_lower_string()
    full_name = random_lower_string()
    shop_name = random_lower_string()
    user_in = UserCreate(
        email=email,
        password=password,
        username=username,
        full_name=full_name,
        shop_name=shop_name,
    )
    user = crud.create_user(session=db, user_create=user_in)
    assert user.is_superuser is False


def test_get_user(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    username = random_lower_string()
    full_name = random_lower_string()
    shop_name = random_lower_string()
    user_in = UserCreate(
        email=email,
        password=password,
        username=username,
        full_name=full_name,
        shop_name=shop_name,
        is_superuser=True,
    )
    user = crud.create_user(session=db, user_create=user_in)
    user_2 = db.get(User, user.id)
    assert user_2
    assert user.email == user_2.email
    assert jsonable_encoder(user) == jsonable_encoder(user_2)


def test_update_user(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    username = random_lower_string()
    full_name = random_lower_string()
    shop_name = random_lower_string()
    user_in = UserCreate(
        email=email,
        password=password,
        username=username,
        full_name=full_name,
        shop_name=shop_name,
        is_superuser=True,
    )
    user = crud.create_user(session=db, user_create=user_in)
    new_password = random_lower_string()
    user_in_update = UserUpdate(password=new_password, is_superuser=True)
    if user.id is not None:
        crud.update_user(session=db, db_user=user, user_in=user_in_update)
    user_2 = db.get(User, user.id)
    assert user_2
    assert user.email == user_2.email
    assert verify_password(new_password, user_2.hashed_password)


@patch("app.api.services.PostgresRepo", autospec=True)
def test_authenticate_mock(mock_postgres_repo, mock_session, mock_user):
    mock_postgres_repo_instance = mock_postgres_repo.return_value
    mock_postgres_repo_instance.read_by.return_value = mock_user
    mock_user.email = "test@example.com"
    mock_user.hashed_password = get_password_hash("password123")

    result = authenticate(mock_session, "test@example.com", "password123")

    mock_postgres_repo.assert_called_once_with(mock_session, User)
    mock_postgres_repo_instance.read_by.assert_called_once_with(
        "email", "test@example.com"
    )
    assert result == mock_user


@patch("app.api.services.PostgresRepo", autospec=True)
def test_create_user_mock(mock_postgres_repo, mock_session, mock_user_create):
    mock_postgres_repo_instance = mock_postgres_repo.return_value
    mock_postgres_repo_instance.create.return_value = mock_user

    result = create_user(mock_session, mock_user_create)

    mock_postgres_repo.assert_called_once_with(mock_session, User)
    mock_user_create.model_dump.assert_called_once_with(exclude={"password"})
    mock_postgres_repo_instance.create.assert_called_once_with(
        mock_user_create.model_dump.return_value
    )
    assert result == mock_user


@patch("app.api.services.PostgresRepo", autospec=True)
def test_update_user_mock(mock_postgres_repo, mock_session, mock_user_update):
    mock_postgres_repo_instance = mock_postgres_repo.return_value
    mock_postgres_repo_instance.update.return_value = mock_user

    result = update_user(
        mock_session, UUID("123e4567-e89b-12d3-a456-426614174000"), mock_user_update
    )

    mock_postgres_repo.assert_called_once_with(mock_session, User)
    mock_postgres_repo_instance.update.assert_called_once_with(
        UUID("123e4567-e89b-12d3-a456-426614174000"),
        mock_user_update.model_dump.return_value,
    )
    assert result == mock_user


@patch("app.api.services.PostgresRepo", autospec=True)
def test_get_user_by_email_mock(mock_postgres_repo, mock_session, mock_user):
    mock_postgres_repo_instance = mock_postgres_repo.return_value
    mock_postgres_repo_instance.read_by.return_value = mock_user
    mock_user.email = "test@example.com"

    result = get_user_by_email(mock_session, "test@example.com")

    mock_postgres_repo.assert_called_once_with(mock_session, User)
    mock_postgres_repo_instance.read_by.assert_called_once_with(
        "email", "test@example.com"
    )
    assert result == mock_user
