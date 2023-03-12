import re
import time

import redis.asyncio as redis
import typing
from datetime import datetime, timedelta
from uuid import UUID

from fastapi import Depends, HTTPException
from redis import Redis
from sqlalchemy import select, or_, update
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status
from starlette.requests import Request

from insightguard.db.dependencies import get_db_session
from insightguard.db.models.user_model import UserModel

from passlib.context import CryptContext

from jose import jwt

from insightguard.settings import settings
from insightguard.web.api.user.schema import UserModelDTO, JWTTokenDTD

MAX_LOGIN_ATTEMPTS = settings.max_login_attempts
JAIL_TIME_SECONDS = settings.jail_time


async def get_login_attempts(r: Redis, ip_address: str) -> int:
    attempts = await r.get(f'login_attempts:{ip_address}')
    if attempts is None:
        return 0
    return int(attempts)


async def get_user_jailed_time(r: Redis, ip_address: str) -> typing.Optional[float]:
    jailed_time = await r.get(f'jailed_users:{ip_address}')
    if jailed_time is None:
        return None
    return float(jailed_time)


async def reset_login_attempts(r: Redis, ip_address: str):
    await r.delete(f'login_attempts:{ip_address}')
    await r.delete(f'jailed_users:{ip_address}')


async def update_login_attempts(r: Redis, ip_address: str):
    attempts = await r.incr(f'login_attempts:{ip_address}', amount=1)
    if attempts >= MAX_LOGIN_ATTEMPTS:
        await r.setex(f'jailed_users:{ip_address}', JAIL_TIME_SECONDS, time.time())


def is_valid_uuid(uuid_to_test, version=4):
    """
    Check if uuid_to_test is a valid UUID.

     Parameters
    ----------
    uuid_to_test : str
    version : {1, 2, 3, 4}

     Returns
    -------
    `True` if uuid_to_test is a valid UUID, otherwise `False`.

     Examples
    --------
    >>> is_valid_uuid('c9bf9e57-1685-4c89-bafb-ff5af830be8a')
    True
    >>> is_valid_uuid('c9bf9e58')
    False
    """

    try:
        uuid_obj = UUID(uuid_to_test, version=version)
    except ValueError:
        return False
    return str(uuid_obj) == uuid_to_test


class JWT:
    @staticmethod
    def create_access_token(subject: typing.Union[str, typing.Any]) -> str:
        expires_delta = datetime.utcnow() + timedelta(
            minutes=settings.access_token_expire_minutes)

        to_encode = {"exp": expires_delta, "sub": str(subject)}
        encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key,
                                 settings.jwt_algorithm)
        return encoded_jwt

    @staticmethod
    def create_refresh_token(subject: typing.Union[str, typing.Any]) -> str:
        expires_delta = datetime.utcnow() + timedelta(
            minutes=settings.refresh_token_expire_minutes)

        to_encode = {"exp": expires_delta, "sub": str(subject)}
        encoded_jwt = jwt.encode(to_encode, settings.jwt_refresh_secret_key,
                                 settings.jwt_algorithm)
        return encoded_jwt


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Hasher:
    @staticmethod
    def verify_password(plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password):
        return pwd_context.hash(password)


class UserDAO:
    """Class for accessing user table."""

    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def create_user(self, username: str, password: str, email: str,
                          full_name: typing.Optional[str],
                          company: typing.Optional[str]) -> None:
        """
        Create user model.

        :param username: username of a user.
        :param password: password of a user.
        :param email: email of a user.
        :param company: company of a user.
        :param full_name: full_name of a user.
        """

        email_regex = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        if not email_regex.match(email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email address",
            )

        # check if user with same username or email exists
        query = select(UserModel).where(
            or_(UserModel.username == username,
                UserModel.email == email)
        )

        exists = await self.session.execute(query)

        if exists.scalar():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with same username or email already exists",
            )

        hashed_password = Hasher.get_password_hash(password)

        self.session.add(
            UserModel(username=username, hashed_password=hashed_password, email=email,
                      full_name=full_name, company=company))

    async def get_user(
        self,
        user_context: str = None,
    ) -> UserModelDTO:
        """
        Get specific user.

        :param user_context: username or email of user instance.
        :return: user models.
        """

        if '@' in user_context:
            query = select(UserModel).where(UserModel.email == user_context)
        elif is_valid_uuid(user_context):
            query = select(UserModel).where(UserModel.id == user_context)
        else:
            query = select(UserModel).where(UserModel.username == user_context)

        user = await self.session.execute(query)
        user = user.scalar()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User doesn't exists",
            )
        return UserModelDTO.from_orm(user)

    async def authorize_user(self, user_context: str, password: str,
                             request: Request) -> JWTTokenDTD:
        """
        Authorize user and returns JWT token for user.

        :param request: request object.
        :param user_context: username or email of a user.
        :param password: password of a user.
        :return: True if user is authorized, False otherwise.
        """

        ip_address = request.headers.get('X-Real-IP', request.client.host)
        redis_client = redis.from_url(str(settings.redis_url))
        attempts = await get_login_attempts(redis_client, ip_address)
        jailed_time = await get_user_jailed_time(redis_client, ip_address)

        if jailed_time:
            raise HTTPException(
                status_code=403,
                detail=f'You are jailed.'
            )

        if '@' in user_context:
            query = select(UserModel).where(
                UserModel.email == user_context)
        else:
            query = select(UserModel).where(
                UserModel.username == user_context)

        user = await self.session.execute(query)
        user = user.scalar()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this username or email doesn't exists",
            )

        if not Hasher.verify_password(password, user.hashed_password):
            await update_login_attempts(redis_client, ip_address)
            attempts += 1
            if attempts >= settings.max_login_attempts:
                await update_login_attempts(redis_client, ip_address)
                raise HTTPException(
                    status_code=403,
                    detail=f'You are jailed for {settings.jail_time} seconds.'
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Incorrect password"
                )

        await reset_login_attempts(redis_client, ip_address)

        return JWTTokenDTD(
            access_token=JWT.create_access_token(user.id),
            refresh_token=JWT.create_refresh_token(user.id)
        )

    async def refresh_token(self, refresh_token: str) -> JWTTokenDTD:
        """
        Refresh JWT token.

        :param refresh_token: refresh token.
        :return: JWT token.
        """

        try:
            payload = jwt.decode(refresh_token, settings.jwt_refresh_secret_key,
                                 algorithms=[settings.jwt_algorithm])
            user_id: str = payload.get("sub")
            if user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid refresh token"
                )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid refresh token"
            )

        return JWTTokenDTD(
            access_token=JWT.create_access_token(user_id),
            refresh_token=refresh_token
        )

    async def update_user(self, user_id: str, username: typing.Optional[str],
                          email: typing.Optional[str],
                          full_name: typing.Optional[str],
                          company: typing.Optional[str]) -> UserModelDTO:
        """
        Update user.

        :param user_id: id of a user.
        :param username: username of a user.
        :param email: email of a user.
        :param company: company of a user.
        :param full_name: full_name of a user.
        """

        # check if user with same username or email exists
        query = select(UserModel).where(
            or_(UserModel.username == username,
                UserModel.email == email)
        )

        exists = await self.session.execute(query)

        if exists.scalar():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with same username or email already exists",
            )

        u = await self.get_user(user_id)

        query = update(UserModel).where(UserModel.id == user_id).values(
            username=username if username else u.username,
            email=email if email else u.email,
            full_name=full_name if full_name else u.full_name,
            company=company if company else u.company
        )

        await self.session.execute(query)

        return await self.get_user(user_id)
