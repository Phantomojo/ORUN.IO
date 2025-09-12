"""
ORUN.IO MVP Backend - Simplified FastAPI server for demo
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import random
from datetime import datetime, timedelta

# Initialize FastAPI app
app = FastAPI(
    title="ORUN.IO MVP API",
    description="Climate Impact Verification Platform - MVP Version",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Project(BaseModel):
    id: int
    name: str
    location: str
    country: str
    project_type: str
    start_date: str
    status: str
    resilience_score: float
    beneficiaries: int
    funding_amount: float
    funding_source: str

class SatelliteData(BaseModel):
    project_id: int
    date: str
    ndvi: float
    ndwi: float
    evi: float
    cloud_cover: float

class CommunityReport(BaseModel):
    id: int
    project_id: int
    reporter_name: str
    report_type: str
    description: str
    location: str
    timestamp: str
    verified: bool

class ImpactAnalysis(BaseModel):
    project_id: int
    treatment_effect: float
    confidence_interval: Dict[str, float]
    p_value: float
    significance: bool
    resilience_score: float
    carbon_sequestration: float

# Sample data
SAMPLE_PROJECTS = [
    {
        "id": 1,
        "name": "Makueni County Sand Dams",
        "location": "Makueni County, Kenya",
        "country": "Kenya",
        "project_type": "Water Management",
        "start_date": "2024-01-15",
        "status": "Active",
        "resilience_score": 78.5,
        "beneficiaries": 5000,
        "funding_amount": 250000.0,
        "funding_source": "Green Climate Fund"
    },
    {
        "id": 2,
        "name": "Niger Delta Mangrove Restoration",
        "location": "Niger Delta, Nigeria",
        "country": "Nigeria",
        "project_type": "Ecosystem Restoration",
        "start_date": "2024-02-01",
        "status": "Active",
        "resilience_score": 82.3,
        "beneficiaries": 8000,
        "funding_amount": 500000.0,
        "funding_source": "African Development Bank"
    },
    {
        "id": 3,
        "name": "Okavango Basin Water Management",
        "location": "Okavango Basin, Botswana",
        "country": "Botswana",
        "project_type": "Water Management",
        "start_date": "2024-03-01",
        "status": "Active",
        "resilience_score": 75.2,
        "beneficiaries": 3000,
        "funding_amount": 350000.0,
        "funding_source": "Adaptation Fund"
    }
]

def generate_satellite_data(project_id: int, days: int = 30) -> List[Dict]:
    """Generate sample satellite data for a project"""
    data = []
    base_date = datetime.now() - timedelta(days=days)
    
    # Base values for different projects
    base_values = {
        1: {"ndvi": 0.35, "ndwi": 0.12, "evi": 0.25},  # Makueni
        2: {"ndvi": 0.45, "ndwi": 0.18, "evi": 0.32},  # Niger Delta
        3: {"ndvi": 0.28, "ndwi": 0.15, "evi": 0.22}   # Okavango
    }
    
    base = base_values.get(project_id, {"ndvi": 0.3, "ndwi": 0.1, "evi": 0.2})
    
    for i in range(days):
        date = base_date + timedelta(days=i)
        
        # Add some realistic variation and trend
        trend_factor = i * 0.001  # Slight upward trend
        variation = random.uniform(-0.05, 0.05)
        
        data.append({
            "project_id": project_id,
            "date": date.strftime("%Y-%m-%d"),
            "ndvi": round(base["ndvi"] + trend_factor + variation, 4),
            "ndwi": round(base["ndwi"] + trend_factor * 0.5 + variation * 0.5, 4),
            "evi": round(base["evi"] + trend_factor * 0.8 + variation * 0.8, 4),
            "cloud_cover": round(random.uniform(0, 25), 2)
        })
    
    return data

def generate_community_reports(project_id: int) -> List[Dict]:
    """Generate sample community reports"""
    report_types = ["Water Access", "Vegetation Health", "Infrastructure", "Community Impact"]
    locations = ["Village A", "Village B", "Village C", "Community Center"]
    
    reports = []
    for i in range(random.randint(5, 15)):
        reports.append({
            "id": i + 1,
            "project_id": project_id,
            "reporter_name": f"Community Member {i + 1}",
            "report_type": random.choice(report_types),
            "description": f"Report about {random.choice(report_types).lower()} in the project area",
            "location": random.choice(locations),
            "timestamp": (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),
            "verified": random.choice([True, True, True, False])  # 75% verified
        })
    
    return reports

# API Endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "ORUN.IO MVP API - Climate Impact Verification Platform",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "projects": "/projects",
            "satellite": "/satellite/{project_id}",
            "community": "/community/{project_id}",
            "impact": "/impact/{project_id}",
            "analytics": "/analytics"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "orun-mvp-api"}

@app.get("/projects", response_model=List[Project])
async def get_projects():
    """Get all projects"""
    return SAMPLE_PROJECTS

@app.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: int):
    """Get specific project"""
    project = next((p for p in SAMPLE_PROJECTS if p["id"] == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.get("/satellite/{project_id}", response_model=List[SatelliteData])
async def get_satellite_data(project_id: int):
    """Get satellite data for a project"""
    if project_id not in [1, 2, 3]:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return generate_satellite_data(project_id)

@app.get("/community/{project_id}", response_model=List[CommunityReport])
async def get_community_reports(project_id: int):
    """Get community reports for a project"""
    if project_id not in [1, 2, 3]:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return generate_community_reports(project_id)

@app.get("/impact/{project_id}", response_model=ImpactAnalysis)
async def get_impact_analysis(project_id: int):
    """Get impact analysis for a project"""
    if project_id not in [1, 2, 3]:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Sample impact analysis data
    impact_data = {
        1: {
            "treatment_effect": 0.13,
            "confidence_interval": {"lower": 0.08, "upper": 0.18},
            "p_value": 0.02,
            "significance": True,
            "resilience_score": 78.5,
            "carbon_sequestration": 1200.0
        },
        2: {
            "treatment_effect": 0.18,
            "confidence_interval": {"lower": 0.12, "upper": 0.24},
            "p_value": 0.01,
            "significance": True,
            "resilience_score": 82.3,
            "carbon_sequestration": 2400.0
        },
        3: {
            "treatment_effect": 0.11,
            "confidence_interval": {"lower": 0.06, "upper": 0.16},
            "p_value": 0.03,
            "significance": True,
            "resilience_score": 75.2,
            "carbon_sequestration": 1800.0
        }
    }
    
    data = impact_data[project_id]
    return ImpactAnalysis(
        project_id=project_id,
        **data
    )

@app.get("/analytics")
async def get_analytics():
    """Get dashboard analytics"""
    total_projects = len(SAMPLE_PROJECTS)
    total_beneficiaries = sum(p["beneficiaries"] for p in SAMPLE_PROJECTS)
    total_funding = sum(p["funding_amount"] for p in SAMPLE_PROJECTS)
    avg_resilience = sum(p["resilience_score"] for p in SAMPLE_PROJECTS) / total_projects
    
    return {
        "total_projects": total_projects,
        "total_beneficiaries": total_beneficiaries,
        "total_funding": total_funding,
        "average_resilience_score": round(avg_resilience, 1),
        "active_projects": len([p for p in SAMPLE_PROJECTS if p["status"] == "Active"]),
        "countries_covered": len(set(p["country"] for p in SAMPLE_PROJECTS)),
        "project_types": list(set(p["project_type"] for p in SAMPLE_PROJECTS))
    }

@app.post("/community/reports")
async def submit_community_report(report: CommunityReport):
    """Submit a new community report"""
    # In a real implementation, this would save to database
    return {
        "message": "Report submitted successfully",
        "report_id": report.id,
        "status": "pending_verification"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
