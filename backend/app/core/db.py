from sqlmodel import Session, create_engine, select

from app.core.config import settings
from app.users.domain import create_user
from app.users.models import User, UserCreate

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


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
