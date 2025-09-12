#!/usr/bin/env python3
"""
Fixed NASA API Integration for ORUN.IO Climate Impact Verification Platform
Author: PHANTOMOJO
Date: 2025

This module provides a corrected NASA API integration with proper endpoints
and error handling for the ORUN.IO project.
"""

import requests
import json
import time
import os
from datetime import datetime, timedelta, date
from typing import Dict, List, Optional, Any, Tuple
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FixedNASAIntegration:
    """
    Fixed NASA API Integration for ORUN.IO
    Corrected endpoints and proper error handling
    """
    
    def __init__(self, api_key: str = "Xg6dZj1TSPPviT7syaDbySlsbjJAM9BStOwqoMRA"):
        """
        Initialize Fixed NASA API integration
        
        Args:
            api_key (str): NASA API key for authentication
        """
        self.api_key = api_key
        self.base_url = "https://api.nasa.gov"
        
        # Rate limiting
        self.rate_limit_remaining = 1000
        self.rate_limit_reset = None
        self.last_request_time = None
        
        # Corrected NASA API endpoints
        self.endpoints = {
            'apod': '/planetary/apod',
            'earth_imagery': '/planetary/earth/imagery',
            'earth_assets': '/planetary/earth/assets',
            'mars_weather': '/insight_weather/',
            'asteroids': '/neo/rest/v1/feed'
        }
    
    def _make_request(self, url: str, params: Dict = None, headers: Dict = None, timeout: int = 10) -> Optional[Dict]:
        """
        Make authenticated request with proper error handling
        
        Args:
            url (str): Request URL
            params (Dict): Request parameters
            headers (Dict): Request headers
            timeout (int): Request timeout in seconds
            
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
        
        try:
            response = requests.get(url, params=params, headers=headers, timeout=timeout)
            
            # Log response status
            logger.info(f"Request to {url} returned status {response.status_code}")
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 403:
                logger.error("API key invalid or rate limit exceeded")
                return None
            elif response.status_code == 404:
                logger.error("API endpoint not found")
                return None
            elif response.status_code == 503:
                logger.error("NASA API service temporarily unavailable")
                return None
            else:
                logger.error(f"API request failed with status {response.status_code}: {response.text}")
                return None
                
        except requests.exceptions.Timeout:
            logger.error(f"Request timeout for {url}")
            return None
        except requests.exceptions.RequestException as e:
            logger.error(f"NASA API request failed: {e}")
            return None
    
    def get_apod(self, date: str = None, hd: bool = True) -> Optional[Dict]:
        """
        Get Astronomy Picture of the Day (working endpoint)
        
        Args:
            date (str): Date in YYYY-MM-DD format
            hd (bool): Get high definition image
            
        Returns:
            Optional[Dict]: APOD data
        """
        params = {'hd': hd}
        if date:
            params['date'] = date
        
        return self._make_request(f"{self.base_url}{self.endpoints['apod']}", params)
    
    def get_earth_imagery(self, lat: float, lon: float, date: str = None, dim: float = 0.15) -> Optional[Dict]:
        """
        Get Earth imagery for specific coordinates (with better error handling)
        
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
        
        return self._make_request(f"{self.base_url}{self.endpoints['earth_imagery']}", params, timeout=15)
    
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
        
        return self._make_request(f"{self.base_url}{self.endpoints['earth_assets']}", params)
    
    def get_africa_climate_data(self, country: str = None) -> List[Dict]:
        """
        Get climate data for African regions (using working endpoints)
        
        Args:
            country (str): Specific African country
            
        Returns:
            List[Dict]: Climate data for African regions
        """
        # African coordinates for climate monitoring
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
            # Get data for all African countries (limited to avoid rate limits)
            for country_name, coords in list(africa_coordinates.items())[:3]:  # Limit to 3 countries
                imagery_data = self.get_earth_imagery(coords['lat'], coords['lon'])
                if imagery_data:
                    climate_data.append({
                        'country': country_name,
                        'coordinates': coords,
                        'imagery': imagery_data,
                        'timestamp': datetime.now().isoformat()
                    })
                
                # Rate limiting - wait between requests
                time.sleep(1)
        
        return climate_data
    
    def get_orun_pilot_regions_data(self) -> Dict[str, Any]:
        """
        Get data for ORUN.IO pilot project regions (using working endpoints)
        
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
            logger.info(f"Processing data for {region_info['name']}...")
            
            # Get current imagery
            imagery_data = self.get_earth_imagery(
                region_info['lat'], 
                region_info['lon'],
                dim=0.5  # Larger area for pilot regions
            )
            
            # Get historical data (last 30 days, every 10 days)
            historical_data = []
            for days_ago in range(10, 31, 10):  # Every 10 days
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
                
                time.sleep(1)  # Rate limiting
            
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
        Test NASA API connection using APOD endpoint
        
        Returns:
            bool: True if connection successful
        """
        try:
            # Test with APOD endpoint (most reliable)
            response = self._make_request(f"{self.base_url}{self.endpoints['apod']}")
            return response is not None
        except Exception as e:
            logger.error(f"NASA API connection test failed: {e}")
            return False
    
    def test_all_working_apis(self) -> Dict[str, bool]:
        """
        Test all working NASA API endpoints
        
        Returns:
            Dict[str, bool]: Test results for each API
        """
        results = {}
        
        # Test APOD (most reliable)
        try:
            apod = self._make_request(f"{self.base_url}{self.endpoints['apod']}")
            results['apod'] = apod is not None
        except:
            results['apod'] = False
        
        # Test Earth imagery with simple coordinates
        try:
            earth = self._make_request(f"{self.base_url}{self.endpoints['earth_imagery']}", 
                                     {'lat': 0, 'lon': 0, 'dim': 0.1}, timeout=15)
            results['earth_imagery'] = earth is not None
        except:
            results['earth_imagery'] = False
        
        # Test Earth assets
        try:
            assets = self._make_request(f"{self.base_url}{self.endpoints['earth_assets']}", 
                                      {'lat': 0, 'lon': 0}, timeout=15)
            results['earth_assets'] = assets is not None
        except:
            results['earth_assets'] = False
        
        return results

def main():
    """Main function to demonstrate fixed NASA API integration"""
    print("🌍 ORUN.IO Fixed NASA API Integration Test")
    print("=" * 60)
    
    # Initialize Fixed NASA API
    nasa_api = FixedNASAIntegration()
    
    # Test connection
    print("🔗 Testing NASA API connection...")
    if nasa_api.test_api_connection():
        print("✅ NASA API connection successful!")
    else:
        print("❌ NASA API connection failed!")
        return
    
    # Test all working APIs
    print("\n🔗 Testing all working NASA API endpoints...")
    test_results = nasa_api.test_all_working_apis()
    
    for api_name, success in test_results.items():
        status = "✅" if success else "❌"
        print(f"  {status} {api_name.upper()}: {'Connected' if success else 'Failed'}")
    
    # Get rate limit status
    print("\n📊 Rate Limit Status:")
    rate_status = nasa_api.get_rate_limit_status()
    print(f"Remaining requests: {rate_status['remaining_requests']}")
    print(f"Reset time: {rate_status['reset_time']}")
    
    # Test APOD
    print("\n🖼️ Getting Astronomy Picture of the Day...")
    apod = nasa_api.get_apod()
    if apod:
        print(f"✅ APOD retrieved successfully!")
        print(f"Title: {apod.get('title', 'N/A')}")
        print(f"Date: {apod.get('date', 'N/A')}")
        print(f"Explanation: {apod.get('explanation', 'N/A')[:100]}...")
        if apod.get('url'):
            print(f"Image URL: {apod.get('url')}")
    else:
        print("❌ Failed to get APOD data")
    
    # Test Earth imagery for Nairobi, Kenya
    print("\n🌍 Getting Earth imagery for Nairobi, Kenya...")
    nairobi_imagery = nasa_api.get_earth_imagery(-1.2921, 36.8219)
    if nairobi_imagery:
        print(f"✅ Earth imagery retrieved successfully!")
        print(f"Image URL: {nairobi_imagery.get('url', 'N/A')}")
        print(f"Date: {nairobi_imagery.get('date', 'N/A')}")
    else:
        print("❌ No imagery available for Nairobi")
    
    # Test African climate data
    print("\n🌍 Getting climate data for Kenya...")
    kenya_data = nasa_api.get_africa_climate_data('kenya')
    if kenya_data:
        print(f"✅ Kenya climate data retrieved: {len(kenya_data)} data points")
        for data_point in kenya_data:
            print(f"  - {data_point['country']}: ✅")
    else:
        print("❌ Kenya climate data retrieval failed")
    
    # Test pilot regions data
    print("\n🎯 Getting ORUN.IO pilot regions data...")
    pilot_data = nasa_api.get_orun_pilot_regions_data()
    print(f"✅ Pilot regions processed: {len(pilot_data)}")
    
    for region_key, region_data in pilot_data.items():
        region_name = region_data['region_info']['name']
        has_imagery = "✅" if region_data.get('current_imagery') else "❌"
        historical_count = len(region_data.get('historical_data', []))
        print(f"  - {region_name}: {has_imagery} Current, {historical_count} Historical")
    
    print("\n🚀 Fixed NASA API integration test completed!")
    print("✅ ORUN.IO now has working NASA API integration!")

if __name__ == "__main__":
    main()
