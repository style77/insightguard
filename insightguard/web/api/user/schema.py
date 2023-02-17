import typing
import uuid

from pydantic import BaseModel


class UserModelInputDTO(BaseModel):
    """DTO for creating new user model."""

    username: str
    password: str
    email: str

    full_name: typing.Optional[str] = None
    company: typing.Optional[str] = None


class UserModelFetchDTD(BaseModel):
    """DTO for fetching user models."""

    id: typing.Optional[uuid.UUID] = None
    username: typing.Optional[str] = None
    email: typing.Optional[str] = None

    class Config:
        orm_mode = True


class UserModelDTD(BaseModel):
    """DTO for fetching user models."""

    id: uuid.UUID
    username: str
    email: str
    full_name: typing.Optional[str] = None
    company: typing.Optional[str] = None

    class Config:
        orm_mode = True


class AuthorizeInputDTD(BaseModel):
    """DTO for authorizing user."""

    user_context: str
    password: str


class JWTTokenDTD(BaseModel):
    """JWT token model."""

    access_token: str
    refresh_token: str

