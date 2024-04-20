# import sentry_sdk

from fastapi import FastAPI, APIRouter
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.users.routes import router as users_router
from app.login.routes import router as login_router
from app.appointments.routes import router as appointments_router
from app.services.routes import router as services_router
from app.clients.routes import router as clients_router


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

api_router = APIRouter()

api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(login_router, prefix="/login", tags=["login"])
api_router.include_router(
    appointments_router, prefix="/appointments", tags=["appointments"]
)
api_router.include_router(services_router, prefix="/services", tags=["services"])
api_router.include_router(clients_router, prefix="/clients", tags=["clients"])

app.include_router(api_router, prefix=settings.API_V1_STR)
