#!/usr/bin/env python3
"""
Enhanced NASA API Integration for ORUN.IO Climate Impact Verification Platform
Author: PHANTOMOJO
Date: 2025

This module integrates multiple NASA APIs including:
- Standard NASA APIs (api.nasa.gov)
- NASA POWER meteorological data
- Earth Polychromatic Imaging Camera (EPIC)
- NASA Image and Video Library

Based on research from:
- NASA API Explorer: https://nasa-api-explorer.vercel.app/
- pynasapower: https://github.com/alekfal/pynasapower
"""

import requests
import json
import time
import os
from datetime import datetime, timedelta, date
from typing import Dict, List, Optional, Any, Tuple
import logging
import pandas as pd

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EnhancedNASAIntegration:
    """
    Enhanced NASA API Integration for ORUN.IO
    Combines multiple NASA data sources for comprehensive climate monitoring
    """
    
    def __init__(self, api_key: str = "Xg6dZj1TSPPviT7syaDbySlsbjJAM9BStOwqoMRA"):
        """
        Initialize Enhanced NASA API integration
        
        Args:
            api_key (str): NASA API key for authentication
        """
        self.api_key = api_key
        self.base_url = "https://api.nasa.gov"
        self.power_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
        self.epic_url = "https://api.nasa.gov/EPIC/api"
        self.image_library_url = "https://images-api.nasa.gov"
        
        # Rate limiting
        self.rate_limit_remaining = 1000
        self.rate_limit_reset = None
        self.last_request_time = None
        
        # NASA API endpoints based on NASA API Explorer
        self.endpoints = {
            'apod': '/planetary/apod',
            'earth_imagery': '/planetary/earth/imagery',
            'earth_assets': '/planetary/earth/assets',
            'epic_natural': '/EPIC/api/natural',
            'epic_enhanced': '/EPIC/api/enhanced',
            'mars_weather': '/insight_weather/',
            'asteroids': '/neo/rest/v1/feed',
            'image_library': '/search',
            'image_asset': '/asset/',
            'image_metadata': '/metadata/'
        }
        
        # NASA POWER parameters for climate monitoring
        self.power_parameters = [
            'TOA_SW_DWN',      # Top of atmosphere solar radiation
            'ALLSKY_SF_SW_DWN', # Surface solar radiation
            'T2M',             # Temperature at 2m
            'T2M_MIN',         # Minimum temperature
            'T2M_MAX',         # Maximum temperature
            'T2MDEW',          # Dew point temperature
            'WS2M',            # Wind speed at 2m
            'PRECTOTCORR',     # Precipitation
            'RH2M',            # Relative humidity
            'PS',              # Surface pressure
            'QV2M',            # Specific humidity
            'ALLSKY_SFC_PAR_TOT', # Photosynthetically active radiation
            'ALLSKY_SFC_UV_INDEX' # UV index
        ]
    
    def _make_request(self, url: str, params: Dict = None, headers: Dict = None) -> Optional[Dict]:
        """
        Make authenticated request with rate limiting
        
        Args:
            url (str): Request URL
            params (Dict): Request parameters
            headers (Dict): Request headers
            
        Returns:
            Optional[Dict]: API response data
        """
        if params is None:
            params = {}
        if headers is None:
            headers = {}
        
        # Add API key for NASA APIs
        if 'api.nasa.gov' in url:
            params['api_key'] = self.api_key
        
        # Check rate limiting
        if self.rate_limit_remaining <= 0:
            logger.warning("Rate limit exceeded. Waiting for reset...")
            return None
        
        try:
            response = requests.get(url, params=params, headers=headers, timeout=30)
            response.raise_for_status()
            
            # Update rate limit information
            if 'X-RateLimit-Remaining' in response.headers:
                self.rate_limit_remaining = int(response.headers['X-RateLimit-Remaining'])
            
            if 'X-RateLimit-Reset' in response.headers:
                self.rate_limit_reset = datetime.fromtimestamp(
                    int(response.headers['X-RateLimit-Reset'])
                )
            
            self.last_request_time = datetime.now()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"NASA API request failed: {e}")
            return None
    
    def get_epic_imagery(self, date: str = None, natural: bool = True) -> Optional[Dict]:
        """
        Get Earth Polychromatic Imaging Camera (EPIC) imagery
        Based on NASA API Explorer EPIC endpoint
        
        Args:
            date (str): Date in YYYY-MM-DD format
            natural (bool): Use natural color imagery (True) or enhanced (False)
            
        Returns:
            Optional[Dict]: EPIC imagery data
        """
        endpoint = self.endpoints['epic_natural'] if natural else self.endpoints['epic_enhanced']
        url = f"{self.base_url}{endpoint}"
        
        params = {}
        if date:
            params['date'] = date
        
        return self._make_request(url, params)
    
    def get_nasa_image_library(self, query: str, media_type: str = "image") -> Optional[Dict]:
        """
        Search NASA Image and Video Library
        Based on NASA API Explorer Image Library
        
        Args:
            query (str): Search query
            media_type (str): Media type (image, video, audio)
            
        Returns:
            Optional[Dict]: Search results
        """
        url = f"{self.image_library_url}{self.endpoints['image_library']}"
        params = {
            'q': query,
            'media_type': media_type
        }
        
        return self._make_request(url, params)
    
    def get_power_meteorological_data(self, lat: float, lon: float, 
                                    start_date: date, end_date: date,
                                    parameters: List[str] = None) -> Optional[pd.DataFrame]:
        """
        Get NASA POWER meteorological data using pynasapower approach
        Based on pynasapower library implementation
        
        Args:
            lat (float): Latitude
            lon (float): Longitude
            start_date (date): Start date
            end_date (date): End date
            parameters (List[str]): Parameters to retrieve
            
        Returns:
            Optional[pd.DataFrame]: Meteorological data
        """
        if parameters is None:
            parameters = self.power_parameters
        
        # Format dates
        start_str = start_date.strftime('%Y%m%d')
        end_str = end_date.strftime('%Y%m%d')
        
        # Build POWER API URL
        params_str = ','.join(parameters)
        url = f"{self.power_url}?parameters={params_str}&community=AG&longitude={lon}&latitude={lat}&start={start_str}&end={end_str}&format=JSON"
        
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if 'properties' in data and 'parameter' in data['properties']:
                # Convert to DataFrame
                df_data = []
                parameters_data = data['properties']['parameter']
                
                for param_name, param_data in parameters_data.items():
                    for date_str, value in param_data.items():
                        df_data.append({
                            'date': datetime.strptime(date_str, '%Y%m%d').date(),
                            'parameter': param_name,
                            'value': value
                        })
                
                df = pd.DataFrame(df_data)
                return df.pivot(index='date', columns='parameter', values='value')
            
        except Exception as e:
            logger.error(f"NASA POWER API request failed: {e}")
            return None
    
    def get_africa_climate_analysis(self, country: str, days_back: int = 30) -> Dict[str, Any]:
        """
        Get comprehensive climate analysis for African countries
        Combines multiple NASA data sources
        
        Args:
            country (str): African country name
            days_back (int): Number of days to look back
            
        Returns:
            Dict[str, Any]: Comprehensive climate data
        """
        # African coordinates
        africa_coordinates = {
            'kenya': {'lat': 0.0236, 'lon': 37.9062, 'name': 'Kenya'},
            'nigeria': {'lat': 9.0765, 'lon': 7.3986, 'name': 'Nigeria'},
            'south_africa': {'lat': -30.5595, 'lon': 22.9375, 'name': 'South Africa'},
            'ethiopia': {'lat': 9.1450, 'lon': 40.4897, 'name': 'Ethiopia'},
            'ghana': {'lat': 7.9465, 'lon': -1.0232, 'name': 'Ghana'},
            'tanzania': {'lat': -6.3690, 'lon': 34.8888, 'name': 'Tanzania'},
            'uganda': {'lat': 1.3733, 'lon': 32.2903, 'name': 'Uganda'},
            'morocco': {'lat': 31.6295, 'lon': -7.9811, 'name': 'Morocco'},
            'algeria': {'lat': 28.0339, 'lon': 1.6596, 'name': 'Algeria'},
            'egypt': {'lat': 26.0975, 'lon': 30.0444, 'name': 'Egypt'}
        }
        
        if country.lower() not in africa_coordinates:
            logger.error(f"Country {country} not found in African coordinates")
            return {}
        
        coords = africa_coordinates[country.lower()]
        lat, lon = coords['lat'], coords['lon']
        
        # Date range
        end_date = date.today()
        start_date = end_date - timedelta(days=days_back)
        
        climate_data = {
            'country': coords['name'],
            'coordinates': {'lat': lat, 'lon': lon},
            'date_range': {'start': start_date.isoformat(), 'end': end_date.isoformat()},
            'data_sources': {}
        }
        
        # Get NASA POWER meteorological data
        logger.info(f"Getting NASA POWER data for {coords['name']}...")
        power_data = self.get_power_meteorological_data(lat, lon, start_date, end_date)
        if power_data is not None:
            climate_data['data_sources']['nasa_power'] = {
                'data': power_data.to_dict('records'),
                'summary': {
                    'avg_temperature': power_data['T2M'].mean() if 'T2M' in power_data.columns else None,
                    'total_precipitation': power_data['PRECTOTCORR'].sum() if 'PRECTOTCORR' in power_data.columns else None,
                    'avg_solar_radiation': power_data['ALLSKY_SF_SW_DWN'].mean() if 'ALLSKY_SF_SW_DWN' in power_data.columns else None
                }
            }
        
        # Get Earth imagery
        logger.info(f"Getting Earth imagery for {coords['name']}...")
        earth_imagery = self._make_request(
            f"{self.base_url}{self.endpoints['earth_imagery']}",
            {'lat': lat, 'lon': lon, 'dim': 0.5}
        )
        if earth_imagery:
            climate_data['data_sources']['earth_imagery'] = earth_imagery
        
        # Get EPIC imagery
        logger.info(f"Getting EPIC imagery for {coords['name']}...")
        epic_imagery = self.get_epic_imagery()
        if epic_imagery:
            climate_data['data_sources']['epic_imagery'] = epic_imagery
        
        # Get NASA Image Library results
        logger.info(f"Searching NASA Image Library for {coords['name']}...")
        image_library = self.get_nasa_image_library(f"{coords['name']} climate satellite")
        if image_library:
            climate_data['data_sources']['image_library'] = {
                'total_results': image_library.get('collection', {}).get('metadata', {}).get('total_hits', 0),
                'items': image_library.get('collection', {}).get('items', [])[:5]  # First 5 items
            }
        
        climate_data['last_updated'] = datetime.now().isoformat()
        return climate_data
    
    def get_orun_pilot_comprehensive_data(self) -> Dict[str, Any]:
        """
        Get comprehensive data for ORUN.IO pilot regions
        Combines all NASA data sources
        
        Returns:
            Dict[str, Any]: Comprehensive pilot region data
        """
        pilot_regions = {
            'makueni_kenya': {
                'name': 'Makueni County Sand Dams',
                'lat': -2.2833,
                'lon': 37.8333,
                'description': 'Drought resilience through water harvesting',
                'focus': 'Water availability and agricultural productivity'
            },
            'niger_delta': {
                'name': 'Niger Delta Mangrove Restoration',
                'lat': 4.5,
                'lon': 6.0,
                'description': 'Coastal protection and carbon sequestration',
                'focus': 'Mangrove coverage and coastal erosion'
            },
            'okavango_basin': {
                'name': 'Okavango Basin Water Management',
                'lat': -19.0,
                'lon': 22.0,
                'description': 'Sustainable irrigation and water management',
                'focus': 'Water efficiency and agricultural productivity'
            }
        }
        
        comprehensive_data = {}
        
        for region_key, region_info in pilot_regions.items():
            logger.info(f"Processing comprehensive data for {region_info['name']}...")
            
            region_data = {
                'region_info': region_info,
                'data_sources': {},
                'analysis': {}
            }
            
            # Get NASA POWER data (last 90 days)
            end_date = date.today()
            start_date = end_date - timedelta(days=90)
            
            power_data = self.get_power_meteorological_data(
                region_info['lat'], 
                region_info['lon'], 
                start_date, 
                end_date
            )
            
            if power_data is not None:
                region_data['data_sources']['nasa_power'] = {
                    'data': power_data.to_dict('records'),
                    'summary': {
                        'avg_temperature': power_data['T2M'].mean() if 'T2M' in power_data.columns else None,
                        'total_precipitation': power_data['PRECTOTCORR'].sum() if 'PRECTOTCORR' in power_data.columns else None,
                        'avg_solar_radiation': power_data['ALLSKY_SF_SW_DWN'].mean() if 'ALLSKY_SF_SW_DWN' in power_data.columns else None,
                        'avg_humidity': power_data['RH2M'].mean() if 'RH2M' in power_data.columns else None,
                        'avg_wind_speed': power_data['WS2M'].mean() if 'WS2M' in power_data.columns else None
                    }
                }
                
                # Climate analysis
                if 'T2M' in power_data.columns and 'PRECTOTCORR' in power_data.columns:
                    region_data['analysis']['climate_trends'] = {
                        'temperature_trend': 'increasing' if power_data['T2M'].iloc[-7:].mean() > power_data['T2M'].iloc[:7].mean() else 'decreasing',
                        'precipitation_trend': 'increasing' if power_data['PRECTOTCORR'].iloc[-7:].sum() > power_data['PRECTOTCORR'].iloc[:7].sum() else 'decreasing',
                        'drought_risk': 'high' if power_data['PRECTOTCORR'].sum() < 50 else 'low'
                    }
            
            # Get Earth imagery
            earth_imagery = self._make_request(
                f"{self.base_url}{self.endpoints['earth_imagery']}",
                {'lat': region_info['lat'], 'lon': region_info['lon'], 'dim': 0.5}
            )
            if earth_imagery:
                region_data['data_sources']['earth_imagery'] = earth_imagery
            
            # Get EPIC imagery
            epic_imagery = self.get_epic_imagery()
            if epic_imagery:
                region_data['data_sources']['epic_imagery'] = epic_imagery
            
            # Search NASA Image Library for region-specific images
            image_search = self.get_nasa_image_library(f"{region_info['name']} satellite climate")
            if image_search:
                region_data['data_sources']['image_library'] = {
                    'total_results': image_search.get('collection', {}).get('metadata', {}).get('total_hits', 0),
                    'items': image_search.get('collection', {}).get('items', [])[:3]
                }
            
            region_data['last_updated'] = datetime.now().isoformat()
            comprehensive_data[region_key] = region_data
            
            # Rate limiting
            time.sleep(0.5)
        
        return comprehensive_data
    
    def get_rate_limit_status(self) -> Dict[str, Any]:
        """Get current rate limit status"""
        return {
            'remaining_requests': self.rate_limit_remaining,
            'reset_time': self.rate_limit_reset.isoformat() if self.rate_limit_reset else None,
            'last_request': self.last_request_time.isoformat() if self.last_request_time else None,
            'api_key': self.api_key[:10] + "..." if self.api_key else None
        }
    
    def test_all_apis(self) -> Dict[str, bool]:
        """
        Test all NASA API endpoints
        
        Returns:
            Dict[str, bool]: Test results for each API
        """
        results = {}
        
        # Test APOD
        try:
            apod = self._make_request(f"{self.base_url}{self.endpoints['apod']}")
            results['apod'] = apod is not None
        except:
            results['apod'] = False
        
        # Test Earth imagery
        try:
            earth = self._make_request(f"{self.base_url}{self.endpoints['earth_imagery']}", 
                                     {'lat': 0, 'lon': 0, 'dim': 0.1})
            results['earth_imagery'] = earth is not None
        except:
            results['earth_imagery'] = False
        
        # Test EPIC
        try:
            epic = self.get_epic_imagery()
            results['epic'] = epic is not None
        except:
            results['epic'] = False
        
        # Test Image Library
        try:
            images = self.get_nasa_image_library("earth")
            results['image_library'] = images is not None
        except:
            results['image_library'] = False
        
        # Test NASA POWER
        try:
            power_data = self.get_power_meteorological_data(0, 0, date.today(), date.today())
            results['nasa_power'] = power_data is not None
        except:
            results['nasa_power'] = False
        
        return results

def main():
    """Main function to demonstrate enhanced NASA API integration"""
    print("🌍 ORUN.IO Enhanced NASA API Integration Test")
    print("=" * 60)
    
    # Initialize Enhanced NASA API
    nasa_api = EnhancedNASAIntegration()
    
    # Test all APIs
    print("🔗 Testing all NASA API endpoints...")
    test_results = nasa_api.test_all_apis()
    
    for api_name, success in test_results.items():
        status = "✅" if success else "❌"
        print(f"  {status} {api_name.upper()}: {'Connected' if success else 'Failed'}")
    
    # Get rate limit status
    print("\n📊 Rate Limit Status:")
    rate_status = nasa_api.get_rate_limit_status()
    print(f"Remaining requests: {rate_status['remaining_requests']}")
    print(f"Reset time: {rate_status['reset_time']}")
    
    # Test EPIC imagery
    print("\n🛰️ Getting EPIC Earth imagery...")
    epic_data = nasa_api.get_epic_imagery()
    if epic_data:
        print(f"✅ EPIC imagery available: {len(epic_data)} images")
    else:
        print("❌ EPIC imagery not available")
    
    # Test NASA Image Library
    print("\n🖼️ Searching NASA Image Library...")
    image_results = nasa_api.get_nasa_image_library("climate change africa")
    if image_results:
        total_hits = image_results.get('collection', {}).get('metadata', {}).get('total_hits', 0)
        print(f"✅ Found {total_hits} images in NASA Image Library")
    else:
        print("❌ NASA Image Library search failed")
    
    # Test NASA POWER data
    print("\n🌡️ Getting NASA POWER meteorological data...")
    power_data = nasa_api.get_power_meteorological_data(
        -1.2921, 36.8219,  # Nairobi coordinates
        date.today() - timedelta(days=7),
        date.today()
    )
    if power_data is not None:
        print(f"✅ NASA POWER data retrieved: {len(power_data)} days")
        print(f"   Parameters: {list(power_data.columns)}")
    else:
        print("❌ NASA POWER data retrieval failed")
    
    # Test comprehensive African climate analysis
    print("\n🌍 Getting comprehensive climate analysis for Kenya...")
    kenya_data = nasa_api.get_africa_climate_analysis('kenya', days_back=30)
    if kenya_data:
        print(f"✅ Kenya climate analysis completed")
        print(f"   Data sources: {list(kenya_data['data_sources'].keys())}")
    else:
        print("❌ Kenya climate analysis failed")
    
    # Test ORUN.IO pilot regions comprehensive data
    print("\n🎯 Getting comprehensive ORUN.IO pilot regions data...")
    pilot_data = nasa_api.get_orun_pilot_comprehensive_data()
    print(f"✅ Pilot regions processed: {len(pilot_data)}")
    
    for region_key, region_data in pilot_data.items():
        region_name = region_data['region_info']['name']
        data_sources = list(region_data['data_sources'].keys())
        print(f"   - {region_name}: {', '.join(data_sources)}")
    
    print("\n🚀 Enhanced NASA API integration test completed!")
    print("🌍 ORUN.IO now has access to comprehensive NASA data sources!")

if __name__ == "__main__":
    main()
