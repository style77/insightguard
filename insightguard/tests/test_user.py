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
    test_name = uuid.uuid4().hex
    response = await client.put(
        url,
        json={
            "name": test_name,
        },
    )
    assert response.status_code == status.HTTP_200_OK
    dao = UserDAO(dbsession)
    instances = await dao.filter(name=test_name)
    assert instances[0].name == test_name


@pytest.mark.anyio
async def test_getting(
    fastapi_app: FastAPI,
    client: AsyncClient,
    dbsession: AsyncSession,
) -> None:
    """Tests user instance retrieval."""
    dao = UserDAO(dbsession)
    test_name = uuid.uuid4().hex
    test_password = uuid.uuid4().hex
    test_email = uuid.uuid4().hex + "@test.com"
    await dao.create_user(username=test_name, password=test_password, email=test_email)
    url = fastapi_app.url_path_for("get_dummy_models")
    response = await client.get(url)
    dummies = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert len(dummies) == 1
    assert dummies[0]["name"] == test_name
