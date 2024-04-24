import pytest
import uuid
import datetime

from app.services.models import Service


@pytest.fixture
def test_service_dict():
    svc_data = {
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
    return svc_data
