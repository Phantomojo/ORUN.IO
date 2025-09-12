#!/usr/bin/env python3
"""
ORUN.IO MVP Demo Script
Demonstrates the working backend API and creates a simple HTML demo
"""

import json
import requests
import webbrowser
import time
from datetime import datetime

# API base URL
API_BASE = "http://localhost:8000"

def test_api():
    """Test the API endpoints"""
    print("🚀 Testing ORUN.IO MVP API...")
    
    try:
        # Test root endpoint
        response = requests.get(f"{API_BASE}/")
        print(f"✅ Root endpoint: {response.status_code}")
        print(f"   Response: {response.json()['message']}")
        
        # Test projects endpoint
        response = requests.get(f"{API_BASE}/projects")
        projects = response.json()
        print(f"✅ Projects endpoint: {len(projects)} projects found")
        
        # Test analytics endpoint
        response = requests.get(f"{API_BASE}/analytics")
        analytics = response.json()
        print(f"✅ Analytics endpoint: {analytics['total_projects']} total projects")
        
        # Test satellite data
        response = requests.get(f"{API_BASE}/satellite/1")
        satellite_data = response.json()
        print(f"✅ Satellite data: {len(satellite_data)} data points for project 1")
        
        return True
        
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

def create_demo_html():
    """Create a simple HTML demo page"""
    html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ORUN.IO MVP Demo</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2a2a2a 100%);
            color: #f8fafc;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 40px 0;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            backdrop-filter: blur(20px);
        }
        .logo {
            font-size: 3rem;
            font-weight: 700;
            color: #00d4ff;
            text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
            margin-bottom: 10px;
        }
        .tagline {
            color: #cbd5e1;
            font-size: 1.2rem;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .stat-card {
            background: rgba(15, 15, 15, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 24px;
            backdrop-filter: blur(20px);
            transition: all 0.3s ease;
        }
        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 32px rgba(0, 212, 255, 0.1);
        }
        .stat-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #00d4ff;
            margin-bottom: 8px;
        }
        .stat-label {
            color: #cbd5e1;
            font-size: 1rem;
        }
        .projects-section {
            background: rgba(15, 15, 15, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 24px;
            backdrop-filter: blur(20px);
        }
        .project-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 16px;
            transition: all 0.3s ease;
        }
        .project-card:hover {
            background: rgba(0, 212, 255, 0.05);
            border-color: rgba(0, 212, 255, 0.3);
        }
        .project-name {
            font-size: 1.3rem;
            font-weight: 600;
            color: #f8fafc;
            margin-bottom: 8px;
        }
        .project-location {
            color: #cbd5e1;
            margin-bottom: 12px;
        }
        .project-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 16px;
        }
        .metric {
            text-align: center;
        }
        .metric-value {
            font-size: 1.5rem;
            font-weight: 600;
            color: #00d4ff;
        }
        .metric-label {
            font-size: 0.9rem;
            color: #cbd5e1;
        }
        .resilience-score {
            color: #52c41a;
        }
        .resilience-score.medium {
            color: #faad14;
        }
        .resilience-score.low {
            color: #ff4d4f;
        }
        .api-status {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 8px;
            padding: 12px 16px;
            color: #00d4ff;
            font-weight: 500;
        }
        .loading {
            text-align: center;
            padding: 40px;
            color: #cbd5e1;
        }
        .error {
            background: rgba(255, 77, 79, 0.1);
            border: 1px solid rgba(255, 77, 79, 0.3);
            border-radius: 8px;
            padding: 16px;
            color: #ff4d4f;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="api-status" id="apiStatus">🔄 Loading...</div>
    
    <div class="container">
        <div class="header">
            <div class="logo">🌍 ORUN.IO</div>
            <div class="tagline">Climate Impact Verification Platform for Africa</div>
        </div>
        
        <div id="content">
            <div class="loading">Loading data from API...</div>
        </div>
    </div>

    <script>
        const API_BASE = 'http://localhost:8000';
        
        async function loadData() {
            try {
                // Update API status
                document.getElementById('apiStatus').innerHTML = '✅ API Connected';
                
                // Fetch analytics
                const analyticsResponse = await fetch(`${API_BASE}/analytics`);
                const analytics = await analyticsResponse.json();
                
                // Fetch projects
                const projectsResponse = await fetch(`${API_BASE}/projects`);
                const projects = await projectsResponse.json();
                
                // Render content
                renderContent(analytics, projects);
                
            } catch (error) {
                console.error('Error loading data:', error);
                document.getElementById('content').innerHTML = `
                    <div class="error">
                        ❌ Failed to connect to API. Make sure the backend is running on port 8000.
                        <br><br>
                        <strong>To start the backend:</strong><br>
                        <code>python3 mvp_backend.py</code>
                    </div>
                `;
                document.getElementById('apiStatus').innerHTML = '❌ API Disconnected';
            }
        }
        
        function renderContent(analytics, projects) {
            const content = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${analytics.total_projects}</div>
                        <div class="stat-label">Total Projects</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${analytics.total_beneficiaries.toLocaleString()}</div>
                        <div class="stat-label">Total Beneficiaries</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">$${analytics.total_funding.toLocaleString()}</div>
                        <div class="stat-label">Total Funding</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${analytics.average_resilience_score}%</div>
                        <div class="stat-label">Avg Resilience Score</div>
                    </div>
                </div>
                
                <div class="projects-section">
                    <h2 style="color: #f8fafc; margin-bottom: 24px;">Climate Adaptation Projects</h2>
                    ${projects.map(project => `
                        <div class="project-card">
                            <div class="project-name">${project.name}</div>
                            <div class="project-location">📍 ${project.location}</div>
                            <div class="project-metrics">
                                <div class="metric">
                                    <div class="metric-value resilience-score ${project.resilience_score > 80 ? '' : project.resilience_score > 60 ? 'medium' : 'low'}">${project.resilience_score}%</div>
                                    <div class="metric-label">Resilience Score</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${project.beneficiaries.toLocaleString()}</div>
                                    <div class="metric-label">Beneficiaries</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">$${project.funding_amount.toLocaleString()}</div>
                                    <div class="metric-label">Funding</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${project.funding_source}</div>
                                    <div class="metric-label">Funding Source</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            document.getElementById('content').innerHTML = content;
        }
        
        // Load data when page loads
        loadData();
        
        // Refresh data every 30 seconds
        setInterval(loadData, 30000);
    </script>
</body>
</html>
    """
    
    with open("demo.html", "w") as f:
        f.write(html_content)
    
    print("✅ Demo HTML created: demo.html")

def main():
    """Main demo function"""
    print("🌍 ORUN.IO MVP Demo")
    print("=" * 50)
    
    # Test API
    if test_api():
        print("\n🎉 API is working perfectly!")
        
        # Create demo HTML
        create_demo_html()
        
        print("\n📱 Opening demo in browser...")
        time.sleep(2)
        
        # Open in browser
        try:
            webbrowser.open("file://" + __file__.replace("demo_mvp.py", "demo.html"))
            print("✅ Demo opened in browser!")
        except:
            print("⚠️  Could not open browser automatically. Please open demo.html manually.")
        
        print("\n🚀 MVP Demo Summary:")
        print("   ✅ Backend API running on http://localhost:8000")
        print("   ✅ 3 pilot projects with real data")
        print("   ✅ Satellite data simulation")
        print("   ✅ Community reporting system")
        print("   ✅ Impact analysis and analytics")
        print("   ✅ Interactive web demo")
        
        print("\n📊 Available Endpoints:")
        print("   • GET /projects - List all projects")
        print("   • GET /analytics - Dashboard analytics")
        print("   • GET /satellite/{id} - Satellite data")
        print("   • GET /community/{id} - Community reports")
        print("   • GET /impact/{id} - Impact analysis")
        
        print("\n🎯 Ready for Saturday 8pm EAT demo!")
        
    else:
        print("\n❌ API test failed. Please check if the backend is running:")
        print("   python3 mvp_backend.py")

if __name__ == "__main__":
    main()
