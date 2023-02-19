from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from starlette.requests import Request

from insightguard.db.dao.key_dao import KeyDAO
from insightguard.services.insightguard.model import BullyingScanner
from insightguard.web.api.model.schema import PredictionOutputDTO, PredictionInputDTO
from insightguard.web.api.user.schema import SystemUser
from insightguard.web.dependencies import get_current_user

router = APIRouter()


@router.post("/", response_model=PredictionOutputDTO)
async def predict(input: PredictionInputDTO,
                  request: Request,
                  key_dao: KeyDAO = Depends()) -> PredictionOutputDTO:
    """
    Predicts class for input data.

    :param input: input data.
    :param request: current request.
    :param key_dao: key DAO.
    :return: prediction output.
    """

    key = await key_dao.get_key(input.api_key)
    if not key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid API key.",
        )

    if input.language not in request.app.state.scanner.langs:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Language not supported.",
        )

    try:
        scanner = BullyingScanner(input.language)
        prediction = await scanner.predict(input.text)
    except Exception as e:
        print(e)
        # Log the exception
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error predicting message.",
        )

    p = PredictionOutputDTO(
        prediction=prediction, text=input.text, language=input.language, probability=None
    )

    await key_dao.update_key(key)

    return p
