from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import random

from models import models, database
from schemas import schemas

router = APIRouter()

@router.post("/", response_model=schemas.SimulationResult)
def run_simulation(params: schemas.SimulationParameters, db: Session = Depends(database.get_db)):
    scenario = params.scenario
    initial_abilities = params.initial_abilities or {
        "social_ability": 2,
        "cognitive_ability": 2,
        "communication_ability": 2,
        "vocational_ability": 2,
        "emotion_management": 2
    }
    
    steps = params.steps or 10
    
    results = simulate_scenario(scenario, initial_abilities, steps)
    
    new_simulation = models.SimulationResult(
        scenario=scenario,
        patient_id=params.patient_id,
        parameters=params.dict(),
        results=results
    )
    db.add(new_simulation)
    db.commit()
    db.refresh(new_simulation)
    
    return new_simulation

def simulate_scenario(scenario, initial_abilities, steps):
    abilities = initial_abilities.copy()
    history = []
    
    for step in range(steps):
        if scenario == "coffee_shop":
            result = simulate_coffee_shop_step(abilities)
        elif scenario == "social_interaction":
            result = simulate_social_step(abilities)
        elif scenario == "task_execution":
            result = simulate_task_step(abilities)
        else:
            result = simulate_general_step(abilities)
        
        history.append({
            "step": step + 1,
            "interaction": result["interaction"],
            "success": result["success"],
            "abilities": abilities.copy()
        })
        
        if result["success"]:
            for key in abilities:
                abilities[key] = min(5, abilities[key] + random.uniform(0.05, 0.15))
        else:
            for key in abilities:
                abilities[key] = max(1, abilities[key] - random.uniform(0.02, 0.08))
    
    return {
        "initial_abilities": initial_abilities,
        "final_abilities": abilities,
        "steps": history,
        "summary": generate_summary(scenario, initial_abilities, abilities, history)
    }

def simulate_coffee_shop_step(abilities):
    interactions = [
        {"type": "customer_order", "description": "顾客点单：'请给我一杯拿铁'"},
        {"type": "machine_operation", "description": "操作咖啡机制作咖啡"},
        {"type": "serve_customer", "description": "将咖啡递给顾客并说'请慢用'"},
        {"type": "cleanup", "description": "清洗咖啡杯"}
    ]
    
    interaction = random.choice(interactions)
    
    success_chance = 0.3 + sum(abilities.values()) / len(abilities) * 0.7
    success = random.random() < success_chance
    
    return {"interaction": interaction, "success": success}

def simulate_social_step(abilities):
    interactions = [
        {"type": "greeting", "description": "与人打招呼"},
        {"type": "conversation", "description": "进行简单对话"},
        {"type": "eye_contact", "description": "保持眼神交流"},
        {"type": "emotion_recognition", "description": "识别他人情绪"}
    ]
    
    interaction = random.choice(interactions)
    
    success_chance = 0.2 + abilities["social_ability"] * 0.16 + abilities["communication_ability"] * 0.16
    success = random.random() < success_chance
    
    return {"interaction": interaction, "success": success}

def simulate_task_step(abilities):
    interactions = [
        {"type": "follow_instruction", "description": "跟随指令完成任务"},
        {"type": "problem_solving", "description": "解决简单问题"},
        {"type": "time_management", "description": "合理安排时间"},
        {"type": "quality_control", "description": "检查工作质量"}
    ]
    
    interaction = random.choice(interactions)
    
    success_chance = 0.3 + abilities["cognitive_ability"] * 0.14 + abilities["vocational_ability"] * 0.14
    success = random.random() < success_chance
    
    return {"interaction": interaction, "success": success}

def simulate_general_step(abilities):
    interactions = [
        {"type": "daily_task", "description": "完成日常任务"},
        {"type": "new_situation", "description": "适应新情况"},
        {"type": "stress_management", "description": "处理压力"}
    ]
    
    interaction = random.choice(interactions)
    
    avg_ability = sum(abilities.values()) / len(abilities)
    success_chance = 0.3 + avg_ability * 0.14
    success = random.random() < success_chance
    
    return {"interaction": interaction, "success": success}

def generate_summary(scenario, initial, final, history):
    improvements = {}
    for key in initial:
        improvements[key] = round(final[key] - initial[key], 2)
    
    success_count = sum(1 for h in history if h["success"])
    total_steps = len(history)
    
    return {
        "success_rate": round(success_count / total_steps * 100, 2),
        "ability_improvements": improvements,
        "overall_progress": "进步" if sum(improvements.values()) > 0 else "稳定" if sum(improvements.values()) == 0 else "需要更多练习"
    }

@router.get("/", response_model=List[schemas.SimulationResult])
def get_simulations(patient_id: int = None, skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    query = db.query(models.SimulationResult)
    if patient_id:
        query = query.filter(models.SimulationResult.patient_id == patient_id)
    simulations = query.offset(skip).limit(limit).all()
    return simulations

@router.get("/{simulation_id}", response_model=schemas.SimulationResult)
def get_simulation(simulation_id: int, db: Session = Depends(database.get_db)):
    simulation = db.query(models.SimulationResult).filter(models.SimulationResult.id == simulation_id).first()
    if simulation is None:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return simulation
