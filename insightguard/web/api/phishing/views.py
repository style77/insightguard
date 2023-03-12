import traceback
from typing import List

from fastapi import APIRouter, Header, HTTPException, Depends

import redis.asyncio as redis
from starlette import status

from insightguard.db.dao.key_dao import KeyDAO
from insightguard.ratelimiter.limiter import RateLimiter
from insightguard.services.insightguard.models import (PhishingURLClassifier,
                                                       PhishingEmailClassifier)
from insightguard.settings import settings
from insightguard.web.api.phishing.schema import (PhishingURLInputDTO,
                                                  PhishingURLOutputDTO,
                                                  PhishingEmailOutputDTO,
                                                  PhishingEmailInputDTO)

router = APIRouter()

bullying_rate_limiter = RateLimiter(rate_limit=15000, rate_limit_window=86400,
                                    redis_client=redis.from_url(
                                        str(settings.redis_url)))


@router.post("/url", response_model=List[PhishingURLOutputDTO])
async def predict_url(input: PhishingURLInputDTO,
                      x_api_key: str = Header(),
                      key_dao: KeyDAO = Depends(),
                      rate_limiter: RateLimiter = Depends(bullying_rate_limiter)):
    """
    Predicts class for input data.

    :param input: input data.
    :param key_dao: key dao.
    :param rate_limiter: rate limiter.
    :param x_api_key: API key.

    :return: prediction output.
    """

    key = await key_dao.get_key(x_api_key)
    if not key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid API key.",
        )

    try:
        scanner = PhishingURLClassifier(
            "insightguard/services/insightguard/models/phishing.h5")
        prediction = scanner.predict(input.url, normalize=True)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error predicting message.",
        )

    await key_dao.update_key_usage(key)

    return [PhishingURLOutputDTO(url=val['url'], prediction=val['prediction'],
                                 created_at=val['created_at']) for val in prediction]


@router.post('/email', response_model=PhishingEmailOutputDTO)
async def predict_email(input: PhishingEmailInputDTO,
                        x_api_key: str = Header(),
                        key_dao: KeyDAO = Depends(),
                        rate_limiter: RateLimiter = Depends(bullying_rate_limiter)
                        ):
    """
    Predicts class for input data.

    :param input: input data.

    :return: prediction output.
    """

    key = await key_dao.get_key(x_api_key)
    if not key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid API key.",
        )

    try:
        scanner = PhishingEmailClassifier(
            "insightguard/services/insightguard/models/phishing.h5")
        prediction = scanner.predict(input.content)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error predicting message.",
        )

    await key_dao.update_key_usage(key)

    return PhishingEmailOutputDTO(prediction=prediction)
