from datetime import datetime

from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer
from jose import jwt
from pydantic import ValidationError
from starlette import status

from insightguard.db.dao.user_dao import UserDAO
from insightguard.db.models.user_model import UserModel
from insightguard.settings import settings
from insightguard.web.api.schema import TokenPayload
from insightguard.web.api.user.schema import UserModelDTD

oauth2_scheme = HTTPBearer(scheme_name="JWT")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    user_dao: UserDAO = Depends()
) -> UserModelDTD:
    """
    Get current user from database.

    :param token: JWT token.
    :param user_dao: DAO for user model.
    :return: current user.
    """
    # decode JWT token and extract user ID
    payload = jwt.decode(
        token.credentials, settings.jwt_secret_key, algorithms=["HS256"]
    )
    token_data = TokenPayload(**payload)
    user_id = token_data.sub

    user = await user_dao.get_user(user_id)

    return user
