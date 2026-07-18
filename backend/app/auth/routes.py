from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token, decode_access_token
from app.auth.schemas import UserCreate, UserLogin, UserResponse, Token
from app.auth.service import create_user, authenticate_user, get_user_by_email, generate_and_send_otp, verify_user_otp
from app.auth.models import User

router = APIRouter(prefix="/api/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    new_user = create_user(db, user_data)
    generate_and_send_otp(db, new_user)
    return new_user


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if not user.is_verified:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Email not verified. Please verify your account.")
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user


@router.post("/verify-otp")
def verify_otp(email: str, otp: str, db: Session = Depends(get_db)):
    if not verify_user_otp(db, email, otp):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP")
    return {"message": "Email verified successfully"}


@router.post("/resend-otp")
def resend_otp(email: str, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    generate_and_send_otp(db, user)
    return {"message": "OTP resent"}


@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user