from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id         = Column(Integer, primary_key=True, index=True)
    username   = Column(String, unique=True, index=True)
    email      = Column(String, unique=True, index=True)
    password   = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    notes      = relationship("Note", back_populates="owner")

class Note(Base):
    __tablename__ = "notes"
    id         = Column(Integer, primary_key=True, index=True)
    title      = Column(String)
    content    = Column(Text)
    summary    = Column(Text, nullable=True)
    category   = Column(String, default="General")
    pinned     = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    owner_id   = Column(Integer, ForeignKey("users.id"))
    owner      = relationship("User", back_populates="notes")