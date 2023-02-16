from typing import List

from fastapi import HTTPException, APIRouter
from fastapi.param_functions import Depends

from insightguard.db.dao.user_dao import UserDAO
from insightguard.db.models.user_model import UserModel
from insightguard.web.api.user.schema import (UserModelDTO, UserModelInputDTO,
                                              UserModelFetchDTD)

router = APIRouter()


@router.get("/", response_model=List[UserModelDTO])
async def get_user_model(
    user: UserModelFetchDTD = Depends(),
    user_dao: UserDAO = Depends(),
) -> UserModel:
    """
    Retrieve user object from the database.

    :param user: user model object.
    :param user_dao: DAO for user model.
    :return: list of user objects from database.
    """
    if user.id:
        return await user_dao.get_user(user.id)
    elif user.username:
        return await user_dao.get_user(user.username)
    elif user.email:
        return await user_dao.get_user(user.email)
    else:
        raise HTTPException(
            status_code=400,
            detail="You must specify either id, username or email",
        )


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
