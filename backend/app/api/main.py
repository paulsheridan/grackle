from fastapi import APIRouter

from app.api.routes import user, login, health_check, appointment

api_router = APIRouter()
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(
    health_check.router, prefix="/health_check", tags=["health_check"]
)
api_router.include_router(
    appointment.router, prefix="/appointments", tags=["appointments"]
)
