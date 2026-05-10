from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models import models, database
from schemas import schemas

router = APIRouter()

@router.post("/", response_model=schemas.BehaviorRecord)
def create_record(record: schemas.BehaviorRecordCreate, db: Session = Depends(database.get_db)):
    new_record = models.BehaviorRecord(
        user_id=record.user_id,
        record_type=record.record_type,
        data=record.data,
        recorded_by=record.recorded_by
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

@router.get("/user/{user_id}", response_model=List[schemas.BehaviorRecord])
def get_records_by_user(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    records = db.query(models.BehaviorRecord).filter(models.BehaviorRecord.user_id == user_id).offset(skip).limit(limit).all()
    return records

@router.get("/{record_id}", response_model=schemas.BehaviorRecord)
def get_record(record_id: int, db: Session = Depends(database.get_db)):
    record = db.query(models.BehaviorRecord).filter(models.BehaviorRecord.id == record_id).first()
    if record is None:
        raise HTTPException(status_code=404, detail="Record not found")
    return record

@router.delete("/{record_id}")
def delete_record(record_id: int, db: Session = Depends(database.get_db)):
    record = db.query(models.BehaviorRecord).filter(models.BehaviorRecord.id == record_id).first()
    if record is None:
        raise HTTPException(status_code=404, detail="Record not found")
    
    db.delete(record)
    db.commit()
    return {"message": "Record deleted"}
