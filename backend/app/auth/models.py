from sqlalchemy import String, DateTime, Boolean, Column
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    otp_code = Column(String, nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )