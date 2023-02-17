import enum
import uuid
from datetime import datetime

from sqlalchemy.sql.sqltypes import String, UUID, Boolean, DateTime, Integer
from sqlalchemy.orm import mapped_column, Mapped

from insightguard.db.base import Base


def generate_key() -> str:
    return str(uuid.uuid4()).replace('-', '')


class KeyModel(Base):
    __tablename__ = "key"

    id: Mapped[uuid] = mapped_column(UUID(as_uuid=True), primary_key=True,
                                     default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user_id: Mapped[uuid] = mapped_column(UUID(as_uuid=True), nullable=False)
    key: Mapped[str] = mapped_column(String, nullable=False, unique=True,
                                     default=generate_key)
    usage: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    disabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
