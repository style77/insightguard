import uuid

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from insightguard.db.dao.user_dao import UserDAO


@pytest.mark.anyio
async def test_creation(
    fastapi_app: FastAPI,
    client: AsyncClient,
    dbsession: AsyncSession,
) -> None:
    """Tests user instance creation."""
    url = fastapi_app.url_path_for("create_user_model")
    test_username = uuid.uuid4().hex
    test_password = uuid.uuid4().hex
    test_email = uuid.uuid4().hex + "@test.com"
    response = await client.put(
        url,
        json={
            "username": test_username,
            "password": test_password,
            "email": test_email,
        },
    )
    assert response.status_code == status.HTTP_200_OK
    test_user_id = response.json()["id"]
    dao = UserDAO(dbsession)
    instances = await dao.get_user(test_user_id)
    assert instances.username == test_username


@pytest.mark.anyio
async def test_getting(
    fastapi_app: FastAPI,
    client: AsyncClient,
    dbsession: AsyncSession,
) -> None:
    """Tests user instance retrieval."""
    dao = UserDAO(dbsession)
    test_username = uuid.uuid4().hex
    test_password = uuid.uuid4().hex
    test_email = uuid.uuid4().hex + "@test.com"
    await dao.create_user(username=test_username, password=test_password,
                          email=test_email)
    url = fastapi_app.url_path_for("get_user")
    response = await client.get(url)
    user = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert user["username"] == test_username
