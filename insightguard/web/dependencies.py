from datetime import datetime

import redis.asyncio as redis
from fastapi import HTTPException, Depends, FastAPI
from fastapi.security import HTTPBearer, OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status
from starlette.requests import Request

from insightguard.db.dao.key_dao import KeyDAO
from insightguard.db.dao.user_dao import UserDAO
from insightguard.db.dependencies import get_db_session
from insightguard.db.models.key_model import KeyModel
from insightguard.db.models.user_model import UserModel
from insightguard.settings import settings
from insightguard.web.api.schema import TokenPayload
from insightguard.web.api.user.schema import UserModelDTO

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/authorize")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    user_dao: UserDAO = Depends()
) -> UserModelDTO:
    """
    Get current user from database.

    :param token: JWT token.
    :param user_dao: DAO for user bullying.
    :return: current user.
    """
    # decode JWT token and extract user ID
    payload = jwt.decode(
        token, settings.jwt_secret_key, algorithms=["HS256"]
    )
    token_data = TokenPayload(**payload)
    user_id = token_data.sub

    user = await user_dao.get_user(user_id)

    return user
