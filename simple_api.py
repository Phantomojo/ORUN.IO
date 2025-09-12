"""
Simple working API for Orun.io MVP
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import random
from datetime import datetime, timedelta

app = FastAPI(title="Orun.io MVP API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample data
PROJECTS = [
    {
        "id": 1,
        "name": "Makueni County Sand Dams",
        "description": "Community-led water conservation project in Kenya",
        "project_type": "drought_resilience",
        "country": "Kenya",
        "latitude": -1.8,
        "longitude": 37.6,
        "budget": 250000,
        "funding_source": "Green Climate Fund",
        "status": "active"
    },
    {
        "id": 2,
        "name": "Niger Delta Mangrove Restoration",
        "description": "Mangrove restoration for coastal protection in Nigeria",
        "project_type": "coastal_protection",
        "country": "Nigeria",
        "latitude": 4.5,
        "longitude": 6.0,
        "budget": 500000,
        "funding_source": "African Development Bank",
        "status": "active"
    },
    {
        "id": 3,
        "name": "Okavango Basin Water Management",
        "description": "Sustainable water management in Botswana",
        "project_type": "water_management",
        "country": "Botswana",
        "latitude": -19.5,
        "longitude": 22.5,
        "budget": 350000,
        "funding_source": "Adaptation Fund",
        "status": "active"
    }
]

REPORTS = [
    {
        "id": 1,
        "project_id": 1,
        "report_type": "water_availability",
        "description": "Sand dam is holding water well. Water seeping into ground around dam area.",
        "latitude": -1.75,
        "longitude": 37.65,
        "is_verified": True,
        "created_at": "2024-01-15T10:30:00Z"
    },
    {
        "id": 2,
        "project_id": 1,
        "report_type": "crop_yield",
        "description": "Maize yield improved by 30% since sand dam construction.",
        "latitude": -1.78,
        "longitude": 37.62,
        "is_verified": True,
        "created_at": "2024-01-20T14:15:00Z"
    }
]

@app.get("/")
async def root():
    return {"message": "Orun.io MVP API - Working!", "status": "operational"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "orun-mvp"}

@app.get("/projects")
async def get_projects():
    return PROJECTS

@app.get("/projects/{project_id}")
async def get_project(project_id: int):
    project = next((p for p in PROJECTS if p["id"] == project_id), None)
    if not project:
        return {"error": "Project not found"}
    return project

@app.get("/community/reports/{project_id}")
async def get_reports(project_id: int):
    project_reports = [r for r in REPORTS if r["project_id"] == project_id]
    return project_reports

@app.post("/community/reports")
async def submit_report(report_data: dict):
    new_report = {
        "id": len(REPORTS) + 1,
        "project_id": report_data.get("project_id", 1),
        "report_type": report_data.get("report_type", "general"),
        "description": report_data.get("description", ""),
        "latitude": report_data.get("latitude", 0.0),
        "longitude": report_data.get("longitude", 0.0),
        "is_verified": False,
        "created_at": datetime.now().isoformat()
    }
    REPORTS.append(new_report)
    return {"message": "Report submitted successfully", "incentive": "$3.50 USD"}

@app.get("/satellite/indices/{project_id}")
async def get_satellite_data(project_id: int):
    # Generate sample time series data
    time_series = []
    for i in range(12):
        date = (datetime.now() - timedelta(days=365-i*30)).strftime("%Y-%m-%d")
        time_series.append({
            "date": date,
            "ndvi": round(0.4 + random.uniform(-0.1, 0.2), 3),
            "ndwi": round(0.15 + random.uniform(-0.05, 0.1), 3),
            "evi": round(0.25 + random.uniform(-0.05, 0.15), 3)
        })
    
    return {
        "project_id": project_id,
        "indices": {
            "NDVI": time_series,
            "NDWI": time_series,
            "EVI": time_series
        },
        "summary_stats": {
            "NDVI": {"mean": 0.45, "trend": "improving"},
            "NDWI": {"mean": 0.18, "trend": "stable"},
            "EVI": {"mean": 0.31, "trend": "improving"}
        }
    }

@app.get("/impact/analysis/{project_id}")
async def get_impact_analysis(project_id: int):
    return {
        "project_id": project_id,
        "treatment_effect": round(random.uniform(0.1, 0.3), 3),
        "p_value": round(random.uniform(0.01, 0.05), 3),
        "significance": True,
        "resilience_score": round(random.uniform(70, 90), 1),
        "resilience_components": {
            "water_security": round(random.uniform(75, 95), 1),
            "agricultural_productivity": round(random.uniform(65, 85), 1),
            "ecosystem_health": round(random.uniform(70, 90), 1),
            "community_engagement": round(random.uniform(80, 95), 1)
        },
        "is_verified": True
    }

@app.get("/analytics/dashboard")
async def get_dashboard():
    return {
        "total_projects": len(PROJECTS),
        "active_communities": 35,
        "total_reports": len(REPORTS),
        "verified_impact": len([r for r in REPORTS if r["is_verified"]]),
        "funding_unlocked": 2300000
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

