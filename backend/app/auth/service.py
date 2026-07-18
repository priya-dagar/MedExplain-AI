from sqlalchemy.orm import Session
from app.auth.models import User
from app.auth.schemas import UserCreate
from app.core.security import hash_password, verify_password

import random
from datetime import datetime, timedelta
from app.core.email_service import send_otp_email


def generate_and_send_otp(db: Session, user: User):
    otp = str(random.randint(100000, 999999))
    user.otp_code = otp
    user.otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
    db.commit()
    send_otp_email(user.email, otp)


def verify_user_otp(db: Session, email: str, otp: str) -> bool:
    user = get_user_by_email(db, email)
    if not user or not user.otp_code:
        return False
    if user.otp_code != otp:
        return False
    if datetime.utcnow() > user.otp_expires_at:
        return False
    user.is_verified = True
    user.otp_code = None
    user.otp_expires_at = None
    db.commit()
    return True


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user_data: UserCreate) -> User:
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        phone_number=user_data.phone_number,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user