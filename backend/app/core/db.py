from sqlalchemy.orm import Session
from sqlalchemy import create_engine, select

from app.core.config import settings
from app.api.domain.user import create_user
from app.api.models import User
from app.api.schemas import UserCreate


def init_db(session: Session) -> None:
    user = session.execute(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            username=settings.FIRST_SUPERUSER_USERNAME,
            full_name=settings.FIRST_SUPERUSER_NAME,
            shop_name=settings.FIRST_SUPERUSER_SHOP,
            is_superuser=True,
        )
        user = create_user(session=session, user_create=user_in)
