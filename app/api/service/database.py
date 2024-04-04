from uuid import UUID
from pydantic import BaseModel, field_serializer, field_validator
from datetime import datetime, time
from typing import List, Optional

from models import Service


def create_service(service: Service) -> Service:
    table = get_dynamodb_table()
    # TODO: validate that dates are in the future, since Service won't anymore.
    table.put_item(Item=service.to_item())
    return service


def get_service(user_id: str, service_id: str) -> Service:
    table = get_dynamodb_table()

    response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}")
        & Key("SK").eq(f"SRVC#{service_id}")
    )
    return Service(**response["Items"][0])
