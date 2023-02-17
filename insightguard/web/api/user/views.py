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
                                              AuthorizeInputDTD)

router = APIRouter()


@router.get("/", response_model=UserModelDTD)
async def get_user_model(
    user: UserModelFetchDTD = Depends(),
    user_dao: UserDAO = Depends()
) -> UserModelDTD:
    """
    Retrieve user object from the database.

    :param user: user model object.
    :param user_dao: DAO for user model.
    :return: user object from database.
    """
    if user.id:
        user_context = user.id
    elif user.username:
        user_context = user.username
    elif user.email:
        user_context = user.email
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must specify either id, username or email",
        )

    user = await user_dao.get_user(user_context)

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

    :param user: username or email of a user.
    :param user_dao: DAO for user models.
    :return: JWT tokens for user.
    """
    return await user_dao.authorize_user(user.user_context, user.password)


@router.get("/keys", response_model=list[KeyModelDTD])
async def get_user_keys(user_id: uuid.UUID, key_dao: KeyDAO = Depends()):
    keys = await key_dao.get_user_keys(user_id)
    return keys
