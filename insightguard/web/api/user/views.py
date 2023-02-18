import typing
import uuid
from typing import List

from fastapi import HTTPException, APIRouter
from fastapi.param_functions import Depends
from starlette import status

from insightguard.db.dao.key_dao import KeyDAO
from insightguard.db.dao.user_dao import UserDAO
from insightguard.web.api.key.schema import KeyModelDTD
from insightguard.web.api.user.schema import (UserModelInputDTO,
                                              UserModelFetchDTD, UserModelDTD,
                                              JWTTokenDTD,
                                              AuthorizeInputDTD, SystemUser)
from insightguard.web.dependencies import get_current_user

router = APIRouter()


@router.get("/", response_model=UserModelDTD)
async def me(
    user: SystemUser = Depends(get_current_user),
    user_dao: UserDAO = Depends()
) -> UserModelDTD:
    """
    Retrieve current user object from the database.

    :param user: user model object.
    :param user_dao: DAO for user model.
    :return: user object from database.
    """
    return user


@router.put("/")
async def create_user_model(
    new_user_object: UserModelInputDTO,
    user_dao: UserDAO = Depends(),
) -> None:
    """
    Creates user model in the database.

    :param new_user_object: new user model item.
    :param user_dao: DAO for user models.
    """
    await user_dao.create_user(**new_user_object.dict())


@router.post("/authorize", response_model=JWTTokenDTD)
async def authorize_user(
    user: AuthorizeInputDTD,
    user_dao: UserDAO = Depends()
) -> JWTTokenDTD:
    """
    Authorize user and returns JWT token for user.

    :param user: username
    :param user_dao: DAO for user models.
    :return: JWT tokens for user.
    """
    jwt = await user_dao.authorize_user(user.username, user.password)
    return jwt


@router.get("/keys", response_model=list[KeyModelDTD])
async def get_user_keys(user: SystemUser = Depends(get_current_user),
                        key_dao: KeyDAO = Depends()) -> List[KeyModelDTD]:
    keys = await key_dao.get_user_keys(user.id)
    return keys
