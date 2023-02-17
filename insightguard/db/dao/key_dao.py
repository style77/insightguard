import uuid

from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from insightguard.db.dependencies import get_db_session
from insightguard.db.models.key_model import KeyModel
from insightguard.db.models.user_model import UserModel

KEYS_LIMIT = {
    'free': 1,
    'developer': 5,
    'enterprise': 25
}


class KeyDAO:
    """Class for accessing key table."""

    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def create_key(self, user_id: uuid) -> None:
        """
        Add key to session.

        :param user_id: user_id of a key.
        """
        # Check how many keys user has
        keys = await self.get_user_keys(user_id)

        user = await self.session.execute(
            select(UserModel).where(UserModel.id == user_id)
        )
        user = user.scalar()

        if len(keys) >= KEYS_LIMIT[user.account_type]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have reached your key limit",
            )

        self.session.add(KeyModel(user_id=user_id))

    async def get_key(self, key: str) -> KeyModel:
        """
        Get key.

        :param key: key of a key.
        :return: A key object.
        """
        query = select(KeyModel).where(KeyModel.key == key)
        key = await self.session.execute(query)
        key = key.scalar()
        if not key:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Key not found",
            )
        return key

    async def get_user_keys(self, user_id: uuid) -> list[KeyModel]:
        """
        Get all keys from user.

        :return: A list of key objects.
        """
        query = select(KeyModel).where(KeyModel.user_id == user_id)
        keys = await self.session.execute(query)
        keys = keys.scalars().all()
        return keys

