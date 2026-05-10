from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List, Any

class UserBase(BaseModel):
    username: str
    email: EmailStr
    name: str
    role: Optional[str] = "patient"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class AbilityProfileBase(BaseModel):
    social_ability: Optional[int] = 1
    cognitive_ability: Optional[int] = 1
    daily_living_ability: Optional[int] = 1
    emotion_management: Optional[int] = 1
    communication_ability: Optional[int] = 1
    vocational_ability: Optional[int] = 1
    adaptability: Optional[int] = 1
    sensory_ability: Optional[int] = 1

class AbilityProfileCreate(AbilityProfileBase):
    user_id: int

class AbilityProfile(AbilityProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class BehaviorRecordBase(BaseModel):
    record_type: str
    data: dict

class BehaviorRecordCreate(BehaviorRecordBase):
    user_id: int
    recorded_by: int

class BehaviorRecord(BehaviorRecordBase):
    id: int
    user_id: int
    recorded_by: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    name: str
    description: str
    steps: List[str]
    category: Optional[str] = "general"

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class TaskRecordBase(BaseModel):
    task_id: int
    steps_completed: int
    total_steps: int
    intervention_count: int
    quality_score: int
    emotion_state: str

class TaskRecordCreate(TaskRecordBase):
    user_id: int

class TaskRecord(TaskRecordBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class SimulationParameters(BaseModel):
    scenario: str
    patient_id: Optional[int] = None
    initial_abilities: Optional[dict] = None
    steps: Optional[int] = 10

class SimulationResult(BaseModel):
    id: int
    scenario: str
    patient_id: Optional[int]
    parameters: dict
    results: dict
    created_at: datetime
    
    class Config:
        from_attributes = True

class InterventionSuggestion(BaseModel):
    user_id: int
    suggestions: List[str]
    focus_areas: List[str]
