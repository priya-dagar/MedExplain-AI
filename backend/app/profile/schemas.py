from pydantic import BaseModel
from typing import Optional

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    allergies: Optional[str] = None  # comma-separated string from frontend
    medical_history: Optional[str] = None

class ProfileResponse(BaseModel):
    name: str
    email: str
    age: Optional[int]
    gender: Optional[str]
    blood_group: Optional[str]
    allergies: Optional[str]
    medical_history: Optional[str]

    class Config:
        from_attributes = True