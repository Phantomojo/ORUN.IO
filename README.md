# Orun.io Prototype - Climate Impact Verification Platform

## Overview
Orun.io is a hybrid Monitoring & Evaluation (M&E) platform that combines satellite analytics with community-level data collection to provide verifiable impact data for climate adaptation projects in Africa.

## Problem Statement
- Africa faces a $40-50 billion annual climate adaptation finance gap
- Over 50% of adaptation projects lack baseline data for impact verification
- This accountability gap prevents funders from confidently investing in climate resilience

## Solution Architecture

### Core Components
1. **Satellite Data Engine** - Processes Sentinel/Landsat data using BACI methodology
2. **Community Engagement Platform** - Mobile app for ground truth data collection
3. **Impact Verification Dashboard** - Web interface for funders and project managers
4. **Payment System** - Mobile money integration for community incentives

### Technology Stack
- **Backend**: Python/FastAPI with Google Earth Engine integration
- **Frontend**: React.js dashboard with data visualization
- **Mobile**: React Native app for community data collection
- **Database**: PostgreSQL with PostGIS for geospatial data
- **Cloud**: AWS/Azure for scalable satellite data processing

## Pilot Projects
1. **Makueni County Sand Dams** (Kenya) - Drought resilience
2. **Niger Delta Mangrove Restoration** (Nigeria) - Coastal protection
3. **Okavango Basin Water Management** (Botswana/Zambia) - Irrigation

## Key Features
- Real-time satellite data analysis (NDVI, soil moisture, water extent)
- Community data collection via SMS/WhatsApp
- Mobile payment incentives for participation
- BACI statistical analysis for causal impact verification
- Multi-language support for African communities

## Getting Started
See individual component READMEs for setup instructions.

## License
MIT License

