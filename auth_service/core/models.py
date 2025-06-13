from sqlalchemy import (
    Column, Integer, String, Boolean, ForeignKey, DateTime, text, Date
)
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    age = Column(Integer, nullable=True)
    language_preference = Column(String(10), nullable=True, server_default='en')
    timezone = Column(String(50), nullable=True)
    postpartum_start_date = Column(Date, nullable=True)
    doctor_name = Column(String(50), nullable=True)
    doctor_email = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=text('NOW()'))

class RefreshToken(Base):
    __tablename__ = 'refresh_tokens'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    token = Column(String(512), nullable=False)
    issued_at = Column(DateTime, nullable=False, server_default=text('NOW()'))
    expires_at = Column(DateTime, nullable=True)

    user = relationship("User", backref="refresh_tokens")