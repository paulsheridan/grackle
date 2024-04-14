from fastapi import APIRouter


router = APIRouter()


@router.get("/", tags=["health_check"])
def health_check():
    return {"status": "ok"}
