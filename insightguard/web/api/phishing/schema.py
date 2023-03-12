from datetime import datetime
from typing import Union, Set, Dict, Any

from pydantic import BaseModel


class PhishingURLInputDTO(BaseModel):
    url: Set[str]


class PhishingURLOutputDTO(BaseModel):
    created_at: datetime = datetime.now()
    url: str
    prediction: float


class PhishingEmailOutputDTO(BaseModel):
    prediction: float


class PhishingEmailInputDTO(BaseModel):
    content: str
