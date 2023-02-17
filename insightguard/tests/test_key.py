import uuid

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from insightguard.db.dao.key_dao import KeyDAO
from insightguard.db.dao.user_dao import UserDAO


@pytest.mark.anyio
async def test_create_key(
    fastapi_app: FastAPI,
    client: AsyncClient,
    dbsession: AsyncSession,
) -> None:
    """Tests key creation."""
    url = fastapi_app.url_path_for("create_key")

    # Create a user
    user_dao = UserDAO(dbsession)
    test_username = uuid.uuid4().hex
    test_password = uuid.uuid4().hex
    test_email = uuid.uuid4().hex + "@test.com"
    await user_dao.create_user(test_username, test_password,
                               test_email, None, None)

    # Get the user's ID
    user = await user_dao.get_user(test_username)

    response = await client.put(url, params={"user_id": user.id})
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.anyio
async def test_get_key(
    fastapi_app: FastAPI,
    client: AsyncClient,
    dbsession: AsyncSession,
) -> None:
    """Tests key retrieval."""
    dao = KeyDAO(dbsession)

    user_dao = UserDAO(dbsession)
    test_username = uuid.uuid4().hex
    test_password = uuid.uuid4().hex
    test_email = uuid.uuid4().hex + "@test.com"
    await user_dao.create_user(test_username, test_password,
                               test_email, None, None)

    # Get the user's ID
    user = await user_dao.get_user(test_username)

    await dao.create_key(user.id)

    # get user keys
    keys = await dao.get_user_keys(user.id)

    url = fastapi_app.url_path_for("get_key")
    response = await client.get(url, params={"key": keys[0].key})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["user_id"] == str(user.id)
