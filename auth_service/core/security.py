import bcrypt
import jwt
import secrets
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from core.models import RefreshToken

SECRET_KEY = "YOUR_SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.hashpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8")).decode("utf-8") == hashed_password

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token() -> str:
    return secrets.token_hex(32)

def invalidate_refresh_token(token: str, db: Session):
    db_token = db.query(RefreshToken).filter_by(token=token).first()
    if db_token:
        db.delete(db_token)
        db.commit()