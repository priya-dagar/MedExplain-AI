from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime


# What the client sends when registering
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone_number: str | None = None


# What the client sends when logging in
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# What we send back to the client (never includes password_hash)
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone_number: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    
# What we send back after successful login/register
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"