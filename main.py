"""
Orun.io Backend API - Climate Impact Verification Platform
Main FastAPI application with satellite data processing and community engagement
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from dotenv import load_dotenv

from database import get_db, engine
from models import Base
from schemas import (
    ProjectCreate, ProjectResponse, CommunityReportCreate, 
    CommunityReportResponse, ImpactAnalysisResponse, UserCreate, UserResponse
)
from services import (
    ProjectService, CommunityService, SatelliteService, 
    ImpactAnalysisService, PaymentService, AuthService
)
from tasks import process_satellite_data, send_community_incentive

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Orun.io API",
    description="Climate Impact Verification Platform for Africa",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize services
project_service = ProjectService()
community_service = CommunityService()
satellite_service = SatelliteService()
impact_service = ImpactAnalysisService()
payment_service = PaymentService()
auth_service = AuthService()

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Orun.io Climate Impact Verification API",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "projects": "/projects",
            "community": "/community",
            "satellite": "/satellite",
            "impact": "/impact",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "orun-api"}

# Authentication endpoints
@app.post("/auth/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user (funder, project manager, community member)"""
    return await auth_service.register_user(user, db)

@app.post("/auth/login")
async def login_user(email: str, password: str, db: Session = Depends(get_db)):
    """Login user and return JWT token"""
    return await auth_service.login_user(email, password, db)

# Project management endpoints
@app.post("/projects", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(auth_service.get_current_user)
):
    """Create a new climate adaptation project"""
    return await project_service.create_project(project, db, current_user)

@app.get("/projects", response_model=List[ProjectResponse])
async def get_projects(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """Get all projects with pagination"""
    return await project_service.get_projects(skip, limit, db)

@app.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, db: Session = Depends(get_db)):
    """Get specific project details"""
    return await project_service.get_project(project_id, db)

@app.get("/projects/{project_id}/impact", response_model=ImpactAnalysisResponse)
async def get_project_impact(
    project_id: int, 
    db: Session = Depends(get_db)
):
    """Get impact analysis for a specific project"""
    return await impact_service.analyze_project_impact(project_id, db)

# Community engagement endpoints
@app.post("/community/reports", response_model=CommunityReportResponse)
async def submit_community_report(
    report: CommunityReportCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Submit community ground truth data"""
    result = await community_service.submit_report(report, db)
    
    # Trigger incentive payment in background
    background_tasks.add_task(
        send_community_incentive, 
        report.community_member_id, 
        report.project_id
    )
    
    return result

@app.get("/community/reports/{project_id}", response_model=List[CommunityReportResponse])
async def get_community_reports(
    project_id: int,
    db: Session = Depends(get_db)
):
    """Get all community reports for a project"""
    return await community_service.get_project_reports(project_id, db)

# Satellite data endpoints
@app.post("/satellite/process/{project_id}")
async def process_project_satellite_data(
    project_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Trigger satellite data processing for a project"""
    project = await project_service.get_project(project_id, db)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Queue satellite data processing
    background_tasks.add_task(process_satellite_data, project_id)
    
    return {"message": "Satellite data processing queued", "project_id": project_id}

@app.get("/satellite/indices/{project_id}")
async def get_satellite_indices(
    project_id: int,
    start_date: str,
    end_date: str,
    db: Session = Depends(get_db)
):
    """Get satellite-derived indices (NDVI, NDWI, etc.) for a project area"""
    return await satellite_service.get_indices(project_id, start_date, end_date, db)

# Impact analysis endpoints
@app.get("/impact/baci/{project_id}")
async def get_baci_analysis(
    project_id: int,
    db: Session = Depends(get_db)
):
    """Get Before-After-Control-Impact analysis for a project"""
    return await impact_service.get_baci_analysis(project_id, db)

@app.get("/impact/resilience-score/{project_id}")
async def get_resilience_score(
    project_id: int,
    db: Session = Depends(get_db)
):
    """Get calculated resilience score for a project"""
    return await impact_service.get_resilience_score(project_id, db)

# Payment and incentives endpoints
@app.post("/payments/incentive")
async def send_incentive_payment(
    community_member_id: int,
    project_id: int,
    amount: float,
    db: Session = Depends(get_db)
):
    """Send mobile money incentive to community member"""
    return await payment_service.send_incentive(
        community_member_id, project_id, amount, db
    )

@app.get("/payments/history/{community_member_id}")
async def get_payment_history(
    community_member_id: int,
    db: Session = Depends(get_db)
):
    """Get payment history for a community member"""
    return await payment_service.get_payment_history(community_member_id, db)

# Analytics and reporting endpoints
@app.get("/analytics/dashboard")
async def get_dashboard_analytics(db: Session = Depends(get_db)):
    """Get dashboard analytics for funders and project managers"""
    return {
        "total_projects": await project_service.count_projects(db),
        "active_communities": await community_service.count_active_communities(db),
        "total_reports": await community_service.count_reports(db),
        "verified_impact": await impact_service.count_verified_impacts(db),
        "funding_unlocked": await impact_service.calculate_funding_unlocked(db)
    }

@app.get("/analytics/project/{project_id}/timeline")
async def get_project_timeline(
    project_id: int,
    db: Session = Depends(get_db)
):
    """Get project timeline with key milestones and impact data"""
    return await project_service.get_project_timeline(project_id, db)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True
    )

