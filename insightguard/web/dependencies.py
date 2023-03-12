import jose
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from starlette import status
from starlette.requests import Request

from insightguard.db.dao.user_dao import UserDAO
from insightguard.settings import settings
from insightguard.web.api.schema import TokenPayload
from insightguard.web.api.user.schema import UserModelDTO

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/authorize")


async def get_current_user(
    request: Request,
    token: str = Depends(oauth2_scheme),
    user_dao: UserDAO = Depends()
) -> UserModelDTO:
    """
    Get current user from database.

    :param token: JWT token.
    :param request: request object.
    :param user_dao: DAO for user bullying.
    :return: current user.
    """
    # decode JWT token and extract user ID

    try:
        payload = jwt.decode(
            token, settings.jwt_secret_key, algorithms=["HS256"]
        )
    except jose.exceptions.ExpiredSignatureError:
        if request.cookies.get("refresh_token"):
            payload = await user_dao.refresh_token(request.cookies.get("refresh_token"))
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
    token_data = TokenPayload(**payload)
    user_id = token_data.sub

    user = await user_dao.get_user(user_id)

    return user
