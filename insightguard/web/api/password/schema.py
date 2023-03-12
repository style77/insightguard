from pydantic import BaseModel


class PasswordInputDTO(BaseModel):
    password: str


class PasswordGenerateDTD(BaseModel):
    length: int = 16
    include_uppercase: bool = True
    include_lowercase: bool = True
    include_digits: bool = True
    include_special: bool = True
    exclude_similar: bool = True
    exclude_ambiguous: bool = True
