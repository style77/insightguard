from datetime import datetime

from pydantic import BaseModel


class PredictionOutputDTO(BaseModel):
    created_at: datetime = datetime.now()
    text: str
    language: str
    prediction: float


class PredictionInputDTO(BaseModel):
    text: str
    language: str
