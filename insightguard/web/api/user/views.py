from fastapi import APIRouter
from fastapi.param_functions import Depends
from fastapi.security import OAuth2PasswordRequestForm
from starlette.requests import Request
from starlette.responses import JSONResponse

from insightguard.db.dao.key_dao import KeyDAO
from insightguard.db.dao.user_dao import UserDAO
from insightguard.db.models.key_model import KeyModel
from insightguard.settings import settings
from insightguard.web.api.key.schema import KeyModelDTD
from insightguard.web.api.user.schema import (UserModelInputDTO,
                                              UserModelDTO,
                                              JWTTokenDTD,
                                              SystemUser,
                                              UserPatchModelInputDTO)
from insightguard.web.dependencies import (get_current_user)

router = APIRouter()


@router.get("/", response_model=UserModelDTO)
async def me(
    user: SystemUser = Depends(get_current_user)
) -> UserModelDTO:
    """
    Retrieve current user object from the database.

    :param user: user bullying object.
    :return: user object from database.
    """
    return user


@router.put("/")
async def create_user_model(
    new_user_object: UserModelInputDTO,
    user_dao: UserDAO = Depends(),
) -> None:
    """
    Creates user bullying in the database.

    :param new_user_object: new user bullying item.
    :param user_dao: DAO for user models.
    """
    await user_dao.create_user(**new_user_object.dict())


@router.patch('/', response_model=UserModelDTO)
async def update_user_model(
    user: SystemUser = Depends(get_current_user),
    user_dao: UserDAO = Depends(),
    user_object: UserPatchModelInputDTO = None
) -> UserModelDTO:
    """
    Updates user bullying in the database.

    :param user: user bullying object.
    :param user_dao: DAO for user models.
    :param user_object: user bullying object.
    """
    return await user_dao.update_user(user.id.__str__(), **user_object.dict())


@router.post("/authorize", response_model=JWTTokenDTD)
async def authorize_user(
    request: Request,
    user: OAuth2PasswordRequestForm = Depends(),
    user_dao: UserDAO = Depends(),
) -> JSONResponse:
    """
    Authorize user and returns JWT token for user.

    :param request: request object.
    :param user: username
    :param user_dao: DAO for user models.
    :return: JWT tokens for user.
    """
    jwt = await user_dao.authorize_user(user.username, user.password, request)

    response = JSONResponse(content=jwt.dict())

    # Store access token in secure HTTP-only cookie
    response.set_cookie(
        key="access_token",
        value=jwt.access_token,
        max_age=settings.access_token_expire_minutes,
        httponly=True,
        secure=True,
        samesite="strict"
    )

    # Store refresh token in secure HTTP-only cookie
    response.set_cookie(
        key="refresh_token",
        value=jwt.refresh_token,
        max_age=settings.refresh_token_expire_minutes,
        httponly=True,
        secure=True,
        samesite="strict"
    )

    response.set_cookie('logged_in', 'True',
                        max_age=settings.access_token_expire_minutes,
                        httponly=False, secure=True, samesite='strict')

    return response


@router.post("/refresh", response_model=JWTTokenDTD)
async def refresh_token_func(
    refresh_token: str,
    user_dao: UserDAO = Depends(),
) -> JSONResponse:
    """
    Refresh access token using refresh token.

    :param refresh_token: JWT refresh token.
    :param user_dao: DAO for user models.
    :return: JWT tokens for user.
    """
    jwt = await user_dao.refresh_token(refresh_token)

    response = JSONResponse(content=jwt.dict())

    # Set new access token in cookie
    response.set_cookie(
        key="access_token",
        value=jwt.access_token,
        max_age=settings.access_token_expire_minutes,
        httponly=True,
        secure=True,
        samesite="strict"
    )

    return response


@router.get("/keys", response_model=list[KeyModelDTD])
async def get_user_keys(user: SystemUser = Depends(get_current_user),
                        key_dao: KeyDAO = Depends()) -> list[KeyModel]:
    return await key_dao.get_user_keys(user.id)
