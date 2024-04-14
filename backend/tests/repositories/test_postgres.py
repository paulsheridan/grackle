import pytest
from datetime import datetime
from uuid import UUID
from unittest.mock import Mock
from sqlalchemy.orm import Query
from sqlalchemy.orm.session import Session

from app.api.models import Base
from app.api.repositories.postgres import PostgresRepo


@pytest.fixture
def mock_session():
    return Mock(spec=Session)


@pytest.fixture
def mock_model():
    return Mock(spec=Base)


@pytest.fixture
def repo(mock_session, mock_model):
    return PostgresRepo(session=mock_session, model=mock_model)


def test_list(repo, mock_session, mock_model):
    mock_query = Mock(spec=Query)
    mock_session.scalars.return_value.all.return_value = [mock_model()]

    mock_session.query.return_value = mock_query
    result = repo.list(filter_attr=None, filter_val=None, skip=0, limit=100)

    mock_session.query.assert_called_once_with(mock_model)
    mock_query.offset.assert_called_once_with(0)
    mock_query.limit.assert_called_once_with(100)
    mock_session.scalars.assert_called_once_with(mock_query)
    assert result == [mock_model()]


def test_read(repo, mock_session, mock_model):
    mock_query = Mock(spec=Query)
    mock_session.scalars.return_value.first.return_value = mock_model()

    mock_session.query.return_value = mock_query
    result = repo.read(obj_id=UUID("123e4567-e89b-12d3-a456-426614174000"))

    mock_session.query.assert_called_once_with(mock_model)
    mock_query.filter.assert_called_once_with(
        mock_model.id == UUID("123e4567-e89b-12d3-a456-426614174000")
    )
    mock_session.scalars.assert_called_once_with(mock_query)
    assert result == mock_model()


def test_create(repo, mock_session, mock_model):
    data_in = {"key": "value"}
    mock_new_obj = mock_model.return_value

    result = repo.create(data_in)

    mock_model.assert_called_once_with(**data_in)
    mock_session.add.assert_called_once_with(mock_new_obj)
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once_with(mock_new_obj)
    assert result == mock_new_obj


def test_update(repo, mock_session, mock_model):
    mock_query = Mock(spec=Query)
    mock_session.scalar.return_value = mock_model()

    result = repo.update(
        model_id=UUID("123e4567-e89b-12d3-a456-426614174000"), data_in={"key": "value"}
    )

    mock_session.scalar.assert_called_once()
    assert result == mock_model()


def test_delete(repo, mock_session, mock_model):
    mock_query = Mock(spec=Query)
    mock_session.scalar.return_value = None

    result = repo.delete(model_id=UUID("123e4567-e89b-12d3-a456-426614174000"))

    mock_session.scalar.assert_called_once()
    assert result is None


def test_list_between_dates(repo, mock_session, mock_model):
    mock_query = Mock(spec=Query)
    mock_session.scalars.return_value.all.return_value = [mock_model()]

    mock_session.query.return_value = mock_query
    start = datetime(2024, 1, 1)
    end = datetime(2024, 1, 10)
    result = repo.list_between_dates(
        filter_attr=None, filter_val=None, start=start, end=end, skip=0, limit=100
    )

    mock_session.query.assert_called_once_with(mock_model)
    mock_query.filter.assert_called_once()
    mock_session.scalars.assert_called_once_with(mock_query)
    assert result == [mock_model()]


def test_read_by(repo, mock_session, mock_model):
    mock_query = Mock(spec=Query)
    mock_session.scalars.return_value.first.return_value = mock_model()

    mock_session.query.return_value = mock_query
    result = repo.read_by(filter_attr="attr", filter_val="value")

    mock_session.query.assert_called_once_with(mock_model)
    mock_query.filter.assert_called_once_with(getattr(mock_model, "attr") == "value")
    mock_session.scalars.assert_called_once_with(mock_query)
    assert result == mock_model()
