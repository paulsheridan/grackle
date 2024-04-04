import pytest
import uuid

from domain.service import get_service, Service


@pytest.fixture
def test_service_json():
    svc_data = {
        "name": "Tattoo Consult",
        "active": False,
        "duration": 30,
        "max_per_day": 2,
        "start": "2024-04-01",
        "end": "2024-07-28",
        "schedule": [
            {"weekday": 0, "open": "11:00:00", "close": "14:00:00"},
            {"weekday": 2, "open": "11:00:00", "close": "14:00:00"},
            {"weekday": 4, "open": "11:00:00", "close": "14:00:00"},
            {"weekday": 5, "open": "11:00:00", "close": "14:00:00"},
        ],
    }
    return svc_data


def test_service_properly_decodes_json(test_service_json):
    json_data = test_service_json
    user_id = uuid.uuid4()
    service_id = uuid.uuid4()
    service = Service(service_id=service_id, user_id=user_id, **json_data)
    assert service.to_item() == {
        "PK": f"USER#{user_id}",
        "SK": f"SRVC#{service_id}",
        "active": False,
        "duration": 30,
        "end": "2024-07-28T00:00",
        "item_type": "service",
        "max_per_day": 2,
        "name": "Tattoo Consult",
        "schedule": [
            {
                "weekday": 0,
                "close": "14:00:00",
                "open": "11:00:00",
            },
            {
                "weekday": 2,
                "close": "14:00:00",
                "open": "11:00:00",
            },
            {
                "weekday": 4,
                "close": "14:00:00",
                "open": "11:00:00",
            },
            {
                "weekday": 5,
                "close": "14:00:00",
                "open": "11:00:00",
            },
        ],
        "service_id": f"{service_id}",
        "start": "2024-04-01T00:00",
        "user_id": f"{user_id}",
    }

    assert service.pk() == f"USER#{user_id}"
    assert service.sk() == f"SRVC#{service_id}"
