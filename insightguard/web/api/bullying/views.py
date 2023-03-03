import redis.asyncio as redis
from fastapi import APIRouter, Depends, HTTPException, Header
from starlette import status
from starlette.requests import Request

from insightguard.db.dao.key_dao import KeyDAO
from insightguard.ratelimiter.limiter import RateLimiter
from insightguard.services.insightguard.models import BullyingScanner
from insightguard.settings import settings
from insightguard.web.api.bullying.schema import PredictionOutputDTO, PredictionInputDTO

router = APIRouter()

bullying_rate_limiter = RateLimiter(rate_limit=15000, rate_limit_window=86400,
                                    redis_client=redis.from_url(str(settings.redis_url)))


@router.post("/", response_model=PredictionOutputDTO)
async def predict(input: PredictionInputDTO,
                  request: Request,
                  x_api_key: str = Header(),
                  key_dao: KeyDAO = Depends(),
                  rate_limiter: RateLimiter = Depends(
                      bullying_rate_limiter)) -> PredictionOutputDTO:
    """
    Predicts class for input data.

    :param input: input data.
    :param request: current request.
    :param x_api_key: API key.
    :param key_dao: key DAO.
    :param rate_limiter: rate limiter.
    :return: prediction output.
    """

    key = await key_dao.get_key(x_api_key)
    if not key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid API key.",
        )

    if input.language not in request.app.state.scanner.langs:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Language not supported.",
        )

    try:
        scanner = BullyingScanner(input.language)
        prediction = await scanner.predict(input.text)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error predicting message.",
        )

    p = PredictionOutputDTO(
        prediction=prediction, text=input.text, language=input.language,
        probability=None
    )

    await key_dao.update_key_usage(key)

    return p
