from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(String, default="patient")
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    profile = relationship("AbilityProfile", back_populates="user", uselist=False)
    records = relationship("BehaviorRecord", back_populates="user")

class AbilityProfile(Base):
    __tablename__ = "ability_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    social_ability = Column(Integer, default=1)
    cognitive_ability = Column(Integer, default=1)
    daily_living_ability = Column(Integer, default=1)
    emotion_management = Column(Integer, default=1)
    communication_ability = Column(Integer, default=1)
    vocational_ability = Column(Integer, default=1)
    adaptability = Column(Integer, default=1)
    sensory_ability = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="profile")

class BehaviorRecord(Base):
    __tablename__ = "behavior_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    record_type = Column(String)
    data = Column(JSON)
    recorded_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="records")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    steps = Column(JSON)
    category = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class TaskRecord(Base):
    __tablename__ = "task_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    task_id = Column(Integer, ForeignKey("tasks.id"))
    steps_completed = Column(Integer)
    total_steps = Column(Integer)
    intervention_count = Column(Integer)
    quality_score = Column(Integer)
    emotion_state = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")
    task = relationship("Task")

class SimulationResult(Base):
    __tablename__ = "simulation_results"
    
    id = Column(Integer, primary_key=True, index=True)
    scenario = Column(String)
    patient_id = Column(Integer, ForeignKey("users.id"))
    parameters = Column(JSON)
    results = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    patient = relationship("User")
