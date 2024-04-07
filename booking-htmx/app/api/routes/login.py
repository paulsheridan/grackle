from datetime import timedelta
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import SessionDep
from app.core import security
from app.core.config import settings
from app.core.security import get_password_hash

# from app.api.database import authenticate

router = APIRouter()


@router.post("/access-token", tags=["login"])
def login_access_token(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> dict[str, str]:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    return {"status": "ok"}
