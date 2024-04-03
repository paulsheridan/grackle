from typing import List

from uuid import UUID
from datetime import datetime
from pydantic import EmailStr, field_serializer
from sqlmodel import Field, Relationship, SQLModel


class User(SQLModel):
    user_id: UUID
    username: str
    email: EmailStr
    date_created: datetime
    shop_name: str
    is_active: bool
    date_created: datetime

    @field_serializer("user_id", check_fields=False)
    def serialize_uuid(self, user_id: UUID) -> str:
        return str(user_id)
