from typing import Optional
from datetime import date
from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    doctor_email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    age: Optional[int] = None
    language_preference: Optional[str] = "en"
    timezone: Optional[str] = None
    postpartum_start_date: Optional[date] = None
    doctor_name: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str