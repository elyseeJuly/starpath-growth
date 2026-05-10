import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from models import models, database
from schemas import schemas
from routes import users, profiles, records, tasks, simulations

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="StarPath - ASD社会化辅助支持系统", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(profiles.router, prefix="/api/profiles", tags=["profiles"])
app.include_router(records.router, prefix="/api/records", tags=["records"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(simulations.router, prefix="/api/simulations", tags=["simulations"])

@app.get("/")
def root():
    return {"message": "StarPath API - ASD社会化辅助支持系统"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
