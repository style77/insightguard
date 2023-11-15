from fastapi import APIRouter, Header, Depends, HTTPException

import string
import random
import re

from starlette import status

from insightguard.db.dao.key_dao import KeyDAO
from insightguard.web.api.password.schema import PasswordInputDTO, PasswordGenerateDTD

router = APIRouter()


def password_strength_detect(password):
    length = len(password)
    score = 0 + (1 if length < 12 else 2)
    import re
    if re.search(r'[a-z]', password):
        score += 1
    if re.search(r'[A-Z]', password):
        score += 1
    if re.search(r'\d', password):
        score += 1
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        score += 1
    if len(set(password)) == length:
        score += 1
    return score / 7


@router.get("/strength")
async def password_strength(password: str,
                            x_api_key: str = Header(),
                            key_dao: KeyDAO = Depends()):
    """
    Get password strength.

    :param password: password.
    :param x_api_key: API key.
    :param key_dao: key dao.
    :return: password strength.
    """

    key = await key_dao.get_key(x_api_key)
    if not key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid API key.",
        )

    await key_dao.update_key_usage(key)

    return {"strength": password_strength_detect(password)}


@router.post("/generate")
async def generate_password(password: PasswordGenerateDTD,
                            x_api_key: str = Header(),
                            key_dao: KeyDAO = Depends()):
    """
    Get password strength.

    :param password: password.
    :param x_api_key: API key.
    :param key_dao: key dao.
    :return: prediction output.
    """

    if password.length < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password length should be greater than 6.",
        )
    elif password.length > 32:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password length should be less than 32.",
        )

    key = await key_dao.get_key(x_api_key)
    if not key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid API key.",
        )

    await key_dao.update_key_usage(key)

    score = 0
    generated_password = ''
    while score != 1:
        charset = ''
        if password.include_uppercase:
            charset += string.ascii_uppercase
        if password.include_lowercase:
            charset += string.ascii_lowercase
        if password.include_digits:
            charset += string.digits
        if password.include_special:
            charset += string.punctuation
        if password.exclude_similar:
            charset = re.sub(r'[iIlLoO0]', '', charset)
        if password.exclude_ambiguous:
            charset = re.sub(r'[B8G6I1l0OQDS5Z2]', '', charset)

        generated_password = ''.join(random.choice(charset) for _ in range(password.length))
        score = password_strength_detect(generated_password)

    return {'password': generated_password, 'strength': score}

