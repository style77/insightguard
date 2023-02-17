import uuid

from fastapi import APIRouter, Depends

from insightguard.db.dao.key_dao import KeyDAO
from insightguard.web.api.key.schema import KeyModelDTD

router = APIRouter()


@router.get("/", response_model=KeyModelDTD)
async def get_key(key: str, key_dao: KeyDAO = Depends()):
    return await key_dao.get_key(key)


@router.put("/")
async def create_key(user_id: uuid.UUID, key_dao: KeyDAO = Depends()):
    await key_dao.create_key(user_id)
