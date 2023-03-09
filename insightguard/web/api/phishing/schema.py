from datetime import datetime
from typing import Union, Set, Dict, Any

from pydantic import BaseModel


class PhishingURLInputDTO(BaseModel):
    url: Set[str]


class PhishingURLOutputDTO(BaseModel):
    created_at: datetime = datetime.now()
    url: str
    prediction: float
