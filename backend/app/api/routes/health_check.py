from fastapi import APIRouter


router = APIRouter()


@router.get("/", tags=["health_check"])
def read_users():
    return {"status": "ok"}
