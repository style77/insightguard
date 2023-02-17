from fastapi.routing import APIRouter

from insightguard.web.api import user, monitoring, redis, key

api_router = APIRouter()
api_router.include_router(monitoring.router)
api_router.include_router(user.router, prefix="/user", tags=["user"])
api_router.include_router(redis.router, prefix="/redis", tags=["redis"])
api_router.include_router(key.router, prefix="/key", tags=["key"])
