#!/usr/bin/env python3
"""
NASA API Integration for ORUN.IO Climate Impact Verification Platform
Author: PHANTOMOJO
Date: 2025

This module integrates NASA's APIs to enhance satellite data capabilities
for climate impact verification in Africa.
"""

import requests
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NASAAPIIntegration:
    """
    NASA API Integration class for ORUN.IO
    Provides access to NASA's Earth data, climate information, and satellite imagery
    """
    
    def __init__(self, api_key: str = "Xg6dZj1TSPPviT7syaDbySlsbjJAM9BStOwqoMRA"):
        """
        Initialize NASA API integration
        
        Args:
            api_key (str): NASA API key for authentication
        """
        self.api_key = api_key
        self.base_url = "https://api.nasa.gov"
        self.rate_limit_remaining = 1000  # Default hourly limit
        self.rate_limit_reset = None
        self.last_request_time = None
        
        # NASA API endpoints
        self.endpoints = {
            'apod': '/planetary/apod',  # Astronomy Picture of the Day
            'earth_imagery': '/planetary/earth/imagery',  # Earth imagery
            'earth_assets': '/planetary/earth/assets',  # Earth assets
            'mars_weather': '/insight_weather/',  # Mars weather
            'asteroids': '/neo/rest/v1/feed',  # Near Earth Objects
            'climate_data': '/climate/data',  # Climate data (if available)
            'earth_observatory': '/earth/observatory'  # Earth Observatory data
        }
    
    def _make_request(self, endpoint: str, params: Dict = None) -> Optional[Dict]:
        """
        Make authenticated request to NASA API with rate limiting
        
        Args:
            endpoint (str): API endpoint
            params (Dict): Request parameters
            
        Returns:
            Optional[Dict]: API response data
        """
        if params is None:
            params = {}
        
        # Add API key to parameters
        params['api_key'] = self.api_key
        
        # Check rate limiting
        if self.rate_limit_remaining <= 0:
            logger.warning("Rate limit exceeded. Waiting for reset...")
            return None
        
        # Make request
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            # Update rate limit information from headers
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
    
    def get_earth_imagery(self, lat: float, lon: float, date: str = None, dim: float = 0.15) -> Optional[Dict]:
        """
        Get Earth imagery for specific coordinates
        
        Args:
            lat (float): Latitude
            lon (float): Longitude
            date (str): Date in YYYY-MM-DD format
            dim (float): Dimension of image in degrees
            
        Returns:
            Optional[Dict]: Earth imagery data
        """
        params = {
            'lat': lat,
            'lon': lon,
            'dim': dim
        }
        
        if date:
            params['date'] = date
        
        return self._make_request(self.endpoints['earth_imagery'], params)
    
    def get_earth_assets(self, lat: float, lon: float, date: str = None) -> Optional[Dict]:
        """
        Get Earth assets for specific coordinates
        
        Args:
            lat (float): Latitude
            lon (float): Longitude
            date (str): Date in YYYY-MM-DD format
            
        Returns:
            Optional[Dict]: Earth assets data
        """
        params = {
            'lat': lat,
            'lon': lon
        }
        
        if date:
            params['date'] = date
        
        return self._make_request(self.endpoints['earth_assets'], params)
    
    def get_apod(self, date: str = None, hd: bool = True) -> Optional[Dict]:
        """
        Get Astronomy Picture of the Day
        
        Args:
            date (str): Date in YYYY-MM-DD format
            hd (bool): Get high definition image
            
        Returns:
            Optional[Dict]: APOD data
        """
        params = {'hd': hd}
        
        if date:
            params['date'] = date
        
        return self._make_request(self.endpoints['apod'], params)
    
    def get_africa_climate_data(self, country: str = None) -> List[Dict]:
        """
        Get climate data for African regions
        This is a custom implementation for ORUN.IO's focus on Africa
        
        Args:
            country (str): Specific African country
            
        Returns:
            List[Dict]: Climate data for African regions
        """
        # African coordinates for climate monitoring
        africa_coordinates = {
            'kenya': {'lat': 0.0236, 'lon': 37.9062},
            'nigeria': {'lat': 9.0765, 'lon': 7.3986},
            'south_africa': {'lat': -30.5595, 'lon': 22.9375},
            'ethiopia': {'lat': 9.1450, 'lon': 40.4897},
            'ghana': {'lat': 7.9465, 'lon': -1.0232},
            'tanzania': {'lat': -6.3690, 'lon': 34.8888},
            'uganda': {'lat': 1.3733, 'lon': 32.2903},
            'morocco': {'lat': 31.6295, 'lon': -7.9811},
            'algeria': {'lat': 28.0339, 'lon': 1.6596},
            'egypt': {'lat': 26.0975, 'lon': 30.0444}
        }
        
        climate_data = []
        
        if country and country.lower() in africa_coordinates:
            coords = africa_coordinates[country.lower()]
            imagery_data = self.get_earth_imagery(coords['lat'], coords['lon'])
            if imagery_data:
                climate_data.append({
                    'country': country,
                    'coordinates': coords,
                    'imagery': imagery_data,
                    'timestamp': datetime.now().isoformat()
                })
        else:
            # Get data for all African countries
            for country_name, coords in africa_coordinates.items():
                imagery_data = self.get_earth_imagery(coords['lat'], coords['lon'])
                if imagery_data:
                    climate_data.append({
                        'country': country_name,
                        'coordinates': coords,
                        'imagery': imagery_data,
                        'timestamp': datetime.now().isoformat()
                    })
                
                # Rate limiting - wait between requests
                time.sleep(0.1)
        
        return climate_data
    
    def get_orun_pilot_regions_data(self) -> Dict[str, Any]:
        """
        Get NASA data for ORUN.IO pilot project regions
        
        Returns:
            Dict[str, Any]: Data for pilot regions
        """
        pilot_regions = {
            'makueni_kenya': {
                'name': 'Makueni County Sand Dams',
                'lat': -2.2833,
                'lon': 37.8333,
                'description': 'Drought resilience through water harvesting'
            },
            'niger_delta': {
                'name': 'Niger Delta Mangrove Restoration',
                'lat': 4.5,
                'lon': 6.0,
                'description': 'Coastal protection and carbon sequestration'
            },
            'okavango_basin': {
                'name': 'Okavango Basin Water Management',
                'lat': -19.0,
                'lon': 22.0,
                'description': 'Sustainable irrigation and water management'
            }
        }
        
        pilot_data = {}
        
        for region_key, region_info in pilot_regions.items():
            # Get current imagery
            imagery_data = self.get_earth_imagery(
                region_info['lat'], 
                region_info['lon'],
                dim=0.5  # Larger area for pilot regions
            )
            
            # Get historical data (last 30 days)
            historical_data = []
            for days_ago in range(1, 31, 5):  # Every 5 days
                date = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d')
                hist_imagery = self.get_earth_imagery(
                    region_info['lat'], 
                    region_info['lon'],
                    date=date,
                    dim=0.5
                )
                if hist_imagery:
                    historical_data.append({
                        'date': date,
                        'data': hist_imagery
                    })
                
                time.sleep(0.1)  # Rate limiting
            
            pilot_data[region_key] = {
                'region_info': region_info,
                'current_imagery': imagery_data,
                'historical_data': historical_data,
                'last_updated': datetime.now().isoformat()
            }
        
        return pilot_data
    
    def get_rate_limit_status(self) -> Dict[str, Any]:
        """
        Get current rate limit status
        
        Returns:
            Dict[str, Any]: Rate limit information
        """
        return {
            'remaining_requests': self.rate_limit_remaining,
            'reset_time': self.rate_limit_reset.isoformat() if self.rate_limit_reset else None,
            'last_request': self.last_request_time.isoformat() if self.last_request_time else None,
            'api_key': self.api_key[:10] + "..." if self.api_key else None
        }
    
    def test_api_connection(self) -> bool:
        """
        Test NASA API connection
        
        Returns:
            bool: True if connection successful
        """
        try:
            # Test with APOD endpoint
            response = self._make_request(self.endpoints['apod'])
            return response is not None
        except Exception as e:
            logger.error(f"NASA API connection test failed: {e}")
            return False

def main():
    """
    Main function to demonstrate NASA API integration
    """
    print("🌍 ORUN.IO NASA API Integration Test")
    print("=" * 50)
    
    # Initialize NASA API
    nasa_api = NASAAPIIntegration()
    
    # Test connection
    print("🔗 Testing NASA API connection...")
    if nasa_api.test_api_connection():
        print("✅ NASA API connection successful!")
    else:
        print("❌ NASA API connection failed!")
        return
    
    # Get rate limit status
    print("\n📊 Rate Limit Status:")
    rate_status = nasa_api.get_rate_limit_status()
    print(f"Remaining requests: {rate_status['remaining_requests']}")
    print(f"Reset time: {rate_status['reset_time']}")
    
    # Get APOD
    print("\n🖼️ Getting Astronomy Picture of the Day...")
    apod = nasa_api.get_apod()
    if apod:
        print(f"Title: {apod.get('title', 'N/A')}")
        print(f"Date: {apod.get('date', 'N/A')}")
        print(f"Explanation: {apod.get('explanation', 'N/A')[:100]}...")
    
    # Get Earth imagery for Nairobi, Kenya
    print("\n🌍 Getting Earth imagery for Nairobi, Kenya...")
    nairobi_imagery = nasa_api.get_earth_imagery(-1.2921, 36.8219)
    if nairobi_imagery:
        print(f"Image URL: {nairobi_imagery.get('url', 'N/A')}")
        print(f"Date: {nairobi_imagery.get('date', 'N/A')}")
    
    # Get pilot regions data
    print("\n🎯 Getting ORUN.IO pilot regions data...")
    pilot_data = nasa_api.get_orun_pilot_regions_data()
    print(f"Pilot regions processed: {len(pilot_data)}")
    
    for region_key, region_data in pilot_data.items():
        print(f"  - {region_data['region_info']['name']}: ✅")
    
    print("\n🚀 NASA API integration test completed!")

if __name__ == "__main__":
    main()
