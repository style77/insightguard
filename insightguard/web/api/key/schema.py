import uuid
from datetime import datetime

from pydantic import BaseModel


class KeyModelDTD(BaseModel):
    """DTO for fetching key models."""

    id: uuid.UUID
    created_at: datetime
    key: str
    user_id: uuid.UUID
    usage: int
    disabled: bool

    class Config:
        orm_mode = True
