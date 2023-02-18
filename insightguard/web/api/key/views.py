import uuid

from fastapi import APIRouter, Depends

from insightguard.db.dao.key_dao import KeyDAO
from insightguard.web.api.key.schema import KeyModelDTD
from insightguard.web.api.user.schema import SystemUser
from insightguard.web.dependencies import get_current_user

router = APIRouter()


@router.get("/", response_model=KeyModelDTD)
async def get_key(key: str, key_dao: KeyDAO = Depends()):
    return await key_dao.get_key(key)


@router.put("/")
async def create_key(user: SystemUser = Depends(get_current_user),
                     key_dao: KeyDAO = Depends()):
    await key_dao.create_key(user.id)
