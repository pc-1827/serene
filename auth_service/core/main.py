import datetime
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.models import Base, User, RefreshToken
from core.schemas import RegisterRequest, LoginRequest, RefreshRequest
from core.database import get_db, engine
from core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
    get_password_hash,
    invalidate_refresh_token
)
from datetime import datetime, timedelta

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.post("/auth/register")
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter_by(email=payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )

    hashed_pw = get_password_hash(payload.password)
    user_obj = User(
        email=payload.email,
        password_hash=hashed_pw,
        doctor_email=payload.doctor_email,
        first_name=payload.first_name,
        last_name=payload.last_name,
        date_of_birth=payload.date_of_birth,
        age=payload.age,
        language_preference=payload.language_preference,
        timezone=payload.timezone,
        postpartum_start_date=payload.postpartum_start_date,
        doctor_name=payload.doctor_name
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return {"message": "User registered successfully", "user_id": user_obj.id}

@app.post("/auth/login")
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    user_obj = db.query(User).filter_by(email=payload.email).first()
    if not user_obj or not verify_password(payload.password, user_obj.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token({"user_id": user_obj.id, "roles": ["user"]})
    refresh_token = create_refresh_token()
    expires_at = datetime.now() + timedelta(days=7) 

    db_token = RefreshToken(user_id=user_obj.id, token=refresh_token, expires_at=expires_at)
    db.add(db_token)
    db.commit()
    
    return {
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "user_id": user_obj.id
    }

@app.post("/auth/refresh")
def refresh_token(payload: RefreshRequest, db: Session = Depends(get_db)):
    db_token = db.query(RefreshToken).filter_by(token=payload.refresh_token).first()
    if not db_token:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    access_token = create_access_token({"user_id": db_token.user_id, "roles": ["user"]})
    return {"access_token": access_token}

@app.post("/auth/logout")
def logout(payload: RefreshRequest, db: Session = Depends(get_db)):
    invalidate_refresh_token(payload.refresh_token, db)
    return {"message": "Logged out successfully"}