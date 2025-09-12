# 🌍 ORUN.IO - Climate Impact Verification Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org)

> **Hybrid Monitoring & Evaluation (M&E) platform that combines satellite analytics with community-level data collection to provide verifiable impact data for climate adaptation projects in Africa.**

## 🎯 Problem Statement

- **$40-50 billion** annual climate adaptation finance gap in Africa
- **Over 50%** of adaptation projects lack baseline data for impact verification
- **Accountability gap** prevents funders from confidently investing in climate resilience

## 🚀 Solution Architecture

### Core Components
1. **🛰️ Satellite Data Engine** - Processes Sentinel/Landsat data using BACI methodology
2. **📱 Community Engagement Platform** - Mobile app for ground truth data collection
3. **📊 Impact Verification Dashboard** - Web interface for funders and project managers
4. **💰 Payment System** - Mobile money integration for community incentives

### Technology Stack
- **Backend**: Python/FastAPI with Google Earth Engine integration
- **Frontend**: React.js dashboard with data visualization
- **Mobile**: React Native app for community data collection
- **Database**: PostgreSQL with PostGIS for geospatial data
- **Cloud**: AWS/Azure for scalable satellite data processing

## 🌟 Key Features

- **Real-time satellite data analysis** (NDVI, soil moisture, water extent)
- **Community data collection** via SMS/WhatsApp
- **Mobile payment incentives** for participation
- **BACI statistical analysis** for causal impact verification
- **Multi-language support** for African communities
- **3D Earth visualization** with interactive globe rendering

## 🎮 Live Demos

### 🌐 Web Dashboard
- **Main Dashboard**: [View Live Demo](https://phantomojo.github.io/ORUN.IO/)
- **Enhanced Features**: [Advanced Demo](https://phantomojo.github.io/ORUN.IO/enhanced_dashboard.html)
- **Mobile Earth**: [Mobile Demo](https://phantomojo.github.io/ORUN.IO/mobile_earth.html)

### 🛰️ Earth Visualization
- **Professional Globe**: [3D Earth Viewer](https://phantomojo.github.io/ORUN.IO/earth_renders/professional-world-globe.html)
- **2050 Style**: [Future Earth](https://phantomojo.github.io/ORUN.IO/earth_renders/orun-globe-2050-style.html)
- **Data Visualization**: [Climate Data Globe](https://phantomojo.github.io/ORUN.IO/earth_renders/orun-globe-data-viz.html)

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Phantomojo/ORUN.IO.git
   cd ORUN.IO
   ```

2. **Backend Setup**
   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Start backend server
   python main.py
   ```

3. **Frontend Setup**
   ```bash
   # Install Node.js dependencies
   npm install
   
   # Start development server
   npm start
   ```

4. **Launch Demos**
   ```bash
   # Cesium Earth Demo
   python launch_cesium.py
   
   # Hybrid Demo
   python launch_hybrid_demo.py
   
   # PWA Demo
   python launch_pwa_demo.py
   ```

## 📁 Project Structure

```
ORUN.IO/
├── 🌍 earth_renders/          # 3D Earth visualization components
├── 🎨 frontend/               # React.js dashboard and UI
├── 🛰️ orun-3d/               # 3D React components
├── 📱 mobile_earth.html       # Mobile-optimized interface
├── 🐍 *.py                   # Python backend services
├── 📊 enhanced_dashboard.html # Advanced dashboard features
├── 📋 requirements.txt        # Python dependencies
├── 📦 package.json           # Node.js dependencies
└── 📖 README.md              # This file
```

## 🌍 Pilot Projects

1. **🏜️ Makueni County Sand Dams** (Kenya) - Drought resilience
2. **🌊 Niger Delta Mangrove Restoration** (Nigeria) - Coastal protection
3. **💧 Okavango Basin Water Management** (Botswana/Zambia) - Irrigation

## 🛠️ Development

### Available Scripts
- `python main.py` - Start main backend server
- `python demo_cesium.py` - Launch Cesium Earth demo
- `python demo_mvp.py` - Launch MVP demonstration
- `python demo_awwwards.py` - Launch Awwwards-style demo

### Key Files
- `main.py` - Main FastAPI backend server
- `satellite_service.py` - Satellite data processing service
- `frontend/index.html` - Main dashboard interface
- `earth_renders/` - 3D Earth visualization components

## 📊 Data Sources

- **Sentinel-2** satellite imagery for vegetation monitoring
- **Landsat** data for land use change detection
- **Community surveys** via mobile data collection
- **Weather stations** for climate data validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **PHANTOMOJO** - Lead Developer & Climate Tech Innovator

## 🌐 Links

- **Live Demo**: [https://phantomojo.github.io/ORUN.IO/](https://phantomojo.github.io/ORUN.IO/)
- **Documentation**: [Implementation Guide](CURSOR_IDE_IMPLEMENTATION_GUIDE.md)
- **Climate Whitepaper**: [Climate Impact Verification](Orun.io_ClimateImpactVerification_.pdf)

## 🏆 Awards & Recognition

- **Awwwards Design Trends 2025** - Featured in design trends
- **Climate Hackathon** - Finalist project
- **Innovation in M&E** - Breakthrough in impact verification

---

**🌍 Building a more accountable and resilient future for climate adaptation in Africa**

*Made with ❤️ for climate resilience and community empowerment*