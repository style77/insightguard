from fastapi.routing import APIRouter

from insightguard.web.api import user, monitoring, key, bullying, password

api_router = APIRouter()
api_router.include_router(monitoring.router)
api_router.include_router(user.router, prefix="/user", tags=["user"])
api_router.include_router(key.router, prefix="/key", tags=["key"])
api_router.include_router(bullying.router, prefix="/bullying", tags=["bullying"])
api_router.include_router(password.router, prefix="/password", tags=["password"])
