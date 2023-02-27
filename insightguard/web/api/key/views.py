import uuid

from fastapi import APIRouter, Depends, HTTPException
from starlette import status

from insightguard.db.dao.key_dao import KeyDAO
from insightguard.web.api.key.schema import KeyModelDTD
from insightguard.web.api.user.schema import SystemUser
from insightguard.web.dependencies import get_current_user

router = APIRouter()


@router.get("/", response_model=KeyModelDTD)
async def get_key(key: str, key_dao: KeyDAO = Depends()):
    key = await key_dao.get_key(key)
    if not key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid API key.",
        )
    return key


@router.put("/", response_model=KeyModelDTD)
async def create_key(user: SystemUser = Depends(get_current_user),
                     key_dao: KeyDAO = Depends()):
    key = await key_dao.create_key(user.id)
    return KeyModelDTD.from_orm(key)


@router.post("/disable", response_model=KeyModelDTD)
async def lock_key(key: str, user: SystemUser = Depends(get_current_user),
                   key_dao: KeyDAO = Depends()):
    key = await key_dao.get_key(key)
    if not key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid API key.",
        )
    if key.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot disable this key.",
        )
    if key.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This key is already disabled.",
        )
    key.disabled = True
    await key_dao.session.commit()
    await key_dao.session.refresh(key)
    return KeyModelDTD.from_orm(key)


@router.post("/enable", response_model=KeyModelDTD)
async def unlock_key(key: str, user: SystemUser = Depends(get_current_user),
                     key_dao: KeyDAO = Depends()):
    key = await key_dao.get_key(key)
    if not key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid API key.",
        )
    if key.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot disable this key.",
        )
    if not key.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This key is already enabled.",
        )
    key.disabled = False
    await key_dao.session.commit()
    await key_dao.session.refresh(key)
    return KeyModelDTD.from_orm(key)
