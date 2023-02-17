from typing import List

from fastapi import HTTPException, APIRouter
from fastapi.param_functions import Depends
from starlette import status

from insightguard.db.dao.user_dao import UserDAO
from insightguard.db.models.user_model import UserModel
from insightguard.web.api.user.schema import (UserModelInputDTO,
                                              UserModelFetchDTD, UserModelDTD)

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
    :return: list of user objects from database.
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
