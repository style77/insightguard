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
    assert int(response.status_code) == status.HTTP_200_OK


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
                          email=test_email, full_name=None, company=None)
    url = fastapi_app.url_path_for("get_user_model")
    response = await client.get(url, params={"username": test_username})
    user = response.json()

    print(user)

    assert response.status_code == status.HTTP_200_OK
    assert user["username"] == test_username
