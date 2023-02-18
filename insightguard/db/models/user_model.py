import uuid
from datetime import datetime
from typing import Literal

import sqlalchemy
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql.sqltypes import String, UUID, Boolean, DateTime

from insightguard.db.base import Base

AccountType = Literal["free", "developer", "enterprise"]


class UserModel(Base):
    """Model of User."""

    __tablename__ = "user"

    id: Mapped[uuid.UUID] = mapped_column(UUID(), primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime(), default=datetime.utcnow)
    username: Mapped[str] = mapped_column(String(length=200), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(), nullable=False)
    email: Mapped[str] = mapped_column(String(length=200), nullable=False)

    account_type: Mapped[AccountType] = mapped_column(
        sqlalchemy.Enum("free", "developer", "enterprise", name="account_type_enum"),
        default="free",
        nullable=False
    )

    # Required for enterprise users
    full_name: Mapped[str] = mapped_column(String(length=200), nullable=True)
    company: Mapped[str] = mapped_column(String(length=200), nullable=True)

    # Default to True, to force user to activate account
    disabled: Mapped[bool] = mapped_column(Boolean(), nullable=False,
                                           default=True)
