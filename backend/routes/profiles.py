from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from models import models, database
from schemas import schemas

router = APIRouter()

@router.get("/{user_id}", response_model=schemas.AbilityProfile)
def get_profile(user_id: int, db: Session = Depends(database.get_db)):
    profile = db.query(models.AbilityProfile).filter(models.AbilityProfile.user_id == user_id).first()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/{user_id}", response_model=schemas.AbilityProfile)
def update_profile(user_id: int, profile: schemas.AbilityProfileBase, db: Session = Depends(database.get_db)):
    db_profile = db.query(models.AbilityProfile).filter(models.AbilityProfile.user_id == user_id).first()
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    db_profile.social_ability = profile.social_ability
    db_profile.cognitive_ability = profile.cognitive_ability
    db_profile.daily_living_ability = profile.daily_living_ability
    db_profile.emotion_management = profile.emotion_management
    db_profile.communication_ability = profile.communication_ability
    db_profile.vocational_ability = profile.vocational_ability
    db_profile.adaptability = profile.adaptability
    db_profile.sensory_ability = profile.sensory_ability
    db_profile.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.get("/{user_id}/suggestion", response_model=schemas.InterventionSuggestion)
def get_intervention_suggestion(user_id: int, db: Session = Depends(database.get_db)):
    profile = db.query(models.AbilityProfile).filter(models.AbilityProfile.user_id == user_id).first()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    suggestions = []
    focus_areas = []
    
    if profile.social_ability <= 2:
        suggestions.append("建议增加社交互动练习，从简单的问候开始")
        focus_areas.append("社交能力")
    
    if profile.communication_ability <= 2:
        suggestions.append("建议进行语言理解训练")
        focus_areas.append("沟通能力")
    
    if profile.vocational_ability <= 2:
        suggestions.append("建议从简单的重复性任务开始训练")
        focus_areas.append("职业能力")
    
    if profile.emotion_management <= 2:
        suggestions.append("建议学习情绪识别和调节技巧")
        focus_areas.append("情绪管理")
    
    if not suggestions:
        suggestions.append("当前能力水平良好，继续保持训练")
    
    return {
        "user_id": user_id,
        "suggestions": suggestions,
        "focus_areas": focus_areas
    }
