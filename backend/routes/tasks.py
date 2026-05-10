from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from models import models, database
from schemas import schemas

router = APIRouter()

@router.post("/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(database.get_db)):
    new_task = models.Task(
        name=task.name,
        description=task.description,
        steps=task.steps,
        category=task.category
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/", response_model=List[schemas.Task])
def get_tasks(category: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    query = db.query(models.Task)
    if category:
        query = query.filter(models.Task.category == category)
    tasks = query.offset(skip).limit(limit).all()
    return tasks

@router.get("/{task_id}", response_model=schemas.Task)
def get_task(task_id: int, db: Session = Depends(database.get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/record", response_model=schemas.TaskRecord)
def create_task_record(record: schemas.TaskRecordCreate, db: Session = Depends(database.get_db)):
    new_record = models.TaskRecord(
        user_id=record.user_id,
        task_id=record.task_id,
        steps_completed=record.steps_completed,
        total_steps=record.total_steps,
        intervention_count=record.intervention_count,
        quality_score=record.quality_score,
        emotion_state=record.emotion_state
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    
    update_profile_based_on_task(db, record.user_id, record)
    
    return new_record

def update_profile_based_on_task(db, user_id, record):
    profile = db.query(models.AbilityProfile).filter(models.AbilityProfile.user_id == user_id).first()
    if profile:
        completion_rate = record.steps_completed / record.total_steps
        
        if completion_rate >= 0.8:
            if profile.vocational_ability < 5:
                profile.vocational_ability += 1
        elif completion_rate >= 0.5:
            if profile.vocational_ability < 5:
                profile.vocational_ability = min(profile.vocational_ability + 0.5, 5)
        
        profile.updated_at = datetime.utcnow()
        db.commit()

@router.get("/record/user/{user_id}", response_model=List[schemas.TaskRecord])
def get_task_records_by_user(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    records = db.query(models.TaskRecord).filter(models.TaskRecord.user_id == user_id).offset(skip).limit(limit).all()
    return records
