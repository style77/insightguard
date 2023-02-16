import typing

from pydantic import BaseModel


class UserModelDTO(BaseModel):
    """
    DTO for user models.

    It returned when accessing user models from the API.
    """

    id: int
    name: str
    email: str
    full_name: typing.Optional[str] = None
    company: typing.Optional[str] = None

    class Config:
        orm_mode = True


class UserModelInputDTO(BaseModel):
    """DTO for creating new user model."""

    username: str
    password: str
    email: str

    full_name: typing.Optional[str] = None
    company: typing.Optional[str] = None


class UserModelFetchDTD(BaseModel):
    """DTO for fetching user models."""

    id: typing.Optional[str] = None
    username: typing.Optional[str] = None
    email: typing.Optional[str] = None

    class Config:
        orm_mode = True
