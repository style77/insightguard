from pydantic import BaseModel


class TokenPayload(BaseModel):
    sub: str = None
    exp: int = None
