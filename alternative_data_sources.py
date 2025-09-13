#!/usr/bin/env python3
"""
Alternative Data Sources Integration for ORUN.IO Climate Impact Verification Platform
Author: PHANTOMOJO
Date: 2025

This module integrates multiple alternative data sources beyond NASA APIs to provide
comprehensive climate monitoring capabilities for Africa.
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

class AlternativeDataSources:
    """
    Alternative Data Sources Integration for ORUN.IO
    Provides access to multiple satellite and climate data sources
    """
    
    def __init__(self):
        """
        Initialize Alternative Data Sources integration
        """
        self.data_sources = {
            'openweathermap': {
                'base_url': 'https://api.openweathermap.org/data/2.5',
                'api_key': None,  # Set your API key
                'endpoints': {
                    'current': '/weather',
                    'forecast': '/forecast',
                    'historical': '/onecall/timemachine',
                    'satellite': '/satellite'
                }
            },
            'sentinel_hub': {
                'base_url': 'https://services.sentinel-hub.com/api/v1',
                'api_key': None,  # Set your API key
                'endpoints': {
                    'process': '/process',
                    'statistics': '/statistics',
                    'catalog': '/catalog/search'
                }
            },
            'noaa': {
                'base_url': 'https://www.ncdc.noaa.gov/cdo-web/api/v2',
                'api_key': None,  # Set your API key
                'endpoints': {
                    'data': '/data',
                    'datasets': '/datasets',
                    'stations': '/stations'
                }
            },
            'world_bank': {
                'base_url': 'https://api.worldbank.org/v2',
                'api_key': None,  # No API key required
                'endpoints': {
                    'countries': '/countries',
                    'indicators': '/indicators',
                    'data': '/data'
                }
            },
            'openstreetmap': {
                'base_url': 'https://api.openstreetmap.org/api/0.6',
                'api_key': None,  # No API key required
                'endpoints': {
                    'map': '/map',
                    'node': '/node',
                    'way': '/way'
                }
            },
            'copernicus': {
                'base_url': 'https://scihub.copernicus.eu/dhus/api/stub',
                'api_key': None,  # Set your API key
                'endpoints': {
                    'search': '/search',
                    'odata': '/odata/v1'
                }
            }
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
        
        try:
            response = requests.get(url, params=params, headers=headers, timeout=timeout)
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Request failed with status {response.status_code}: {response.text}")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed: {e}")
            return None
    
    def get_openweathermap_data(self, lat: float, lon: float, api_key: str = None) -> Optional[Dict]:
        """
        Get weather data from OpenWeatherMap API
        
        Args:
            lat (float): Latitude
            lon (float): Longitude
            api_key (str): OpenWeatherMap API key
            
        Returns:
            Optional[Dict]: Weather data
        """
        if not api_key:
            logger.warning("OpenWeatherMap API key not provided")
            return None
        
        url = f"{self.data_sources['openweathermap']['base_url']}{self.data_sources['openweathermap']['endpoints']['current']}"
        params = {
            'lat': lat,
            'lon': lon,
            'appid': api_key,
            'units': 'metric'
        }
        
        return self._make_request(url, params)
    
    def get_sentinel_hub_data(self, lat: float, lon: float, api_key: str = None) -> Optional[Dict]:
        """
        Get satellite data from Sentinel Hub
        
        Args:
            lat (float): Latitude
            lon (float): Longitude
            api_key (str): Sentinel Hub API key
            
        Returns:
            Optional[Dict]: Satellite data
        """
        if not api_key:
            logger.warning("Sentinel Hub API key not provided")
            return None
        
        # Example Sentinel Hub request
        url = f"{self.data_sources['sentinel_hub']['base_url']}{self.data_sources['sentinel_hub']['endpoints']['process']}"
        
        payload = {
            "input": {
                "bounds": {
                    "bbox": [lon-0.1, lat-0.1, lon+0.1, lat+0.1],
                    "properties": {
                        "crs": "http://www.opengis.net/def/crs/EPSG/0/4326"
                    }
                },
                "data": [{
                    "type": "sentinel-2-l2a",
                    "dataFilter": {
                        "timeRange": {
                            "from": (datetime.now() - timedelta(days=30)).isoformat(),
                            "to": datetime.now().isoformat()
                        }
                    }
                }]
            },
            "output": {
                "width": 512,
                "height": 512,
                "responses": [{
                    "identifier": "default",
                    "format": {
                        "type": "image/jpeg"
                    }
                }]
            }
        }
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Sentinel Hub request failed: {response.status_code}")
                return None
        except Exception as e:
            logger.error(f"Sentinel Hub request failed: {e}")
            return None
    
    def get_noaa_climate_data(self, lat: float, lon: float, api_key: str = None) -> Optional[Dict]:
        """
        Get climate data from NOAA API
        
        Args:
            lat (float): Latitude
            lon (float): Longitude
            api_key (str): NOAA API key
            
        Returns:
            Optional[Dict]: Climate data
        """
        if not api_key:
            logger.warning("NOAA API key not provided")
            return None
        
        # Find nearest weather station
        url = f"{self.data_sources['noaa']['base_url']}{self.data_sources['noaa']['endpoints']['stations']}"
        params = {
            'locationid': f'ZIP:{lat},{lon}',
            'limit': 1
        }
        headers = {'token': api_key}
        
        station_data = self._make_request(url, params, headers)
        if not station_data:
            return None
        
        # Get climate data
        url = f"{self.data_sources['noaa']['base_url']}{self.data_sources['noaa']['endpoints']['data']}"
        params = {
            'datasetid': 'GHCND',
            'stationid': station_data['results'][0]['id'],
            'startdate': (date.today() - timedelta(days=30)).strftime('%Y-%m-%d'),
            'enddate': date.today().strftime('%Y-%m-%d'),
            'limit': 1000
        }
        
        return self._make_request(url, params, headers)
    
    def get_world_bank_data(self, country_code: str = 'KE') -> Optional[Dict]:
        """
        Get development and climate data from World Bank API
        
        Args:
            country_code (str): Country code (e.g., 'KE' for Kenya)
            
        Returns:
            Optional[Dict]: World Bank data
        """
        # Get climate-related indicators
        indicators = [
            'AG.LND.AGRI.ZS',  # Agricultural land (% of land area)
            'AG.LND.FRST.ZS',  # Forest area (% of land area)
            'AG.LND.PRCP.MM',  # Average precipitation in depth
            'EN.ATM.CO2E.PC',  # CO2 emissions per capita
            'EN.CLC.MDAT.ZS'   # Climate change adaptation
        ]
        
        world_bank_data = {}
        
        for indicator in indicators:
            url = f"{self.data_sources['world_bank']['base_url']}{self.data_sources['world_bank']['endpoints']['data']}"
            params = {
                'country': country_code,
                'indicator': indicator,
                'date': '2010:2023',
                'format': 'json',
                'per_page': 1000
            }
            
            data = self._make_request(url, params)
            if data and len(data) > 1:
                world_bank_data[indicator] = data[1]
        
        return world_bank_data
    
    def get_openstreetmap_data(self, lat: float, lon: float) -> Optional[Dict]:
        """
        Get geospatial data from OpenStreetMap
        
        Args:
            lat (float): Latitude
            lon (float): Longitude
            
        Returns:
            Optional[Dict]: OpenStreetMap data
        """
        # Get map data around coordinates
        url = f"{self.data_sources['openstreetmap']['base_url']}{self.data_sources['openstreetmap']['endpoints']['map']}"
        params = {
            'bbox': f"{lon-0.01},{lat-0.01},{lon+0.01},{lat+0.01}"
        }
        
        return self._make_request(url, params)
    
    def get_copernicus_data(self, lat: float, lon: float, api_key: str = None) -> Optional[Dict]:
        """
        Get satellite data from Copernicus Open Access Hub
        
        Args:
            lat (float): Latitude
            lon (float): Longitude
            api_key (str): Copernicus API key
            
        Returns:
            Optional[Dict]: Copernicus data
        """
        if not api_key:
            logger.warning("Copernicus API key not provided")
            return None
        
        # Search for Sentinel-2 data
        url = f"{self.data_sources['copernicus']['base_url']}{self.data_sources['copernicus']['endpoints']['search']}"
        params = {
            'q': f'footprint:"Intersects({lat},{lon})" AND platformname:Sentinel-2 AND producttype:S2MSI2A',
            'rows': 10,
            'start': 0
        }
        headers = {'Authorization': f'Bearer {api_key}'}
        
        return self._make_request(url, params, headers)
    
    def get_comprehensive_africa_data(self, country: str = 'kenya') -> Dict[str, Any]:
        """
        Get comprehensive data for African countries from multiple sources
        
        Args:
            country (str): African country name
            
        Returns:
            Dict[str, Any]: Comprehensive data
        """
        # African coordinates
        africa_coordinates = {
            'kenya': {'lat': 0.0236, 'lon': 37.9062, 'code': 'KE'},
            'nigeria': {'lat': 9.0765, 'lon': 7.3986, 'code': 'NG'},
            'south_africa': {'lat': -30.5595, 'lon': 22.9375, 'code': 'ZA'},
            'ethiopia': {'lat': 9.1450, 'lon': 40.4897, 'code': 'ET'},
            'ghana': {'lat': 7.9465, 'lon': -1.0232, 'code': 'GH'},
            'tanzania': {'lat': -6.3690, 'lon': 34.8888, 'code': 'TZ'},
            'uganda': {'lat': 1.3733, 'lon': 32.2903, 'code': 'UG'},
            'morocco': {'lat': 31.6295, 'lon': -7.9811, 'code': 'MA'},
            'algeria': {'lat': 28.0339, 'lon': 1.6596, 'code': 'DZ'},
            'egypt': {'lat': 26.0975, 'lon': 30.0444, 'code': 'EG'}
        }
        
        if country.lower() not in africa_coordinates:
            logger.error(f"Country {country} not found in African coordinates")
            return {}
        
        coords = africa_coordinates[country.lower()]
        lat, lon = coords['lat'], coords['lon']
        country_code = coords['code']
        
        comprehensive_data = {
            'country': country.title(),
            'coordinates': {'lat': lat, 'lon': lon},
            'data_sources': {},
            'last_updated': datetime.now().isoformat()
        }
        
        # Get World Bank data (no API key required)
        logger.info(f"Getting World Bank data for {country.title()}...")
        world_bank_data = self.get_world_bank_data(country_code)
        if world_bank_data:
            comprehensive_data['data_sources']['world_bank'] = world_bank_data
        
        # Get OpenStreetMap data (no API key required)
        logger.info(f"Getting OpenStreetMap data for {country.title()}...")
        osm_data = self.get_openstreetmap_data(lat, lon)
        if osm_data:
            comprehensive_data['data_sources']['openstreetmap'] = {
                'status': 'available',
                'data_points': len(osm_data) if isinstance(osm_data, list) else 1
            }
        
        # Note: Other APIs require API keys
        comprehensive_data['data_sources']['api_keys_required'] = [
            'OpenWeatherMap - Weather data',
            'Sentinel Hub - Satellite imagery',
            'NOAA - Climate data',
            'Copernicus - Sentinel satellite data'
        ]
        
        return comprehensive_data
    
    def get_orun_pilot_alternative_data(self) -> Dict[str, Any]:
        """
        Get alternative data for ORUN.IO pilot regions
        
        Returns:
            Dict[str, Any]: Alternative data for pilot regions
        """
        pilot_regions = {
            'makueni_kenya': {
                'name': 'Makueni County Sand Dams',
                'lat': -2.2833,
                'lon': 37.8333,
                'country_code': 'KE',
                'description': 'Drought resilience through water harvesting'
            },
            'niger_delta': {
                'name': 'Niger Delta Mangrove Restoration',
                'lat': 4.5,
                'lon': 6.0,
                'country_code': 'NG',
                'description': 'Coastal protection and carbon sequestration'
            },
            'okavango_basin': {
                'name': 'Okavango Basin Water Management',
                'lat': -19.0,
                'lon': 22.0,
                'country_code': 'BW',
                'description': 'Sustainable irrigation and water management'
            }
        }
        
        pilot_data = {}
        
        for region_key, region_info in pilot_regions.items():
            logger.info(f"Processing alternative data for {region_info['name']}...")
            
            region_data = {
                'region_info': region_info,
                'data_sources': {},
                'last_updated': datetime.now().isoformat()
            }
            
            # Get World Bank data
            world_bank_data = self.get_world_bank_data(region_info['country_code'])
            if world_bank_data:
                region_data['data_sources']['world_bank'] = world_bank_data
            
            # Get OpenStreetMap data
            osm_data = self.get_openstreetmap_data(region_info['lat'], region_info['lon'])
            if osm_data:
                region_data['data_sources']['openstreetmap'] = {
                    'status': 'available',
                    'data_points': len(osm_data) if isinstance(osm_data, list) else 1
                }
            
            pilot_data[region_key] = region_data
        
        return pilot_data
    
    def get_api_key_instructions(self) -> Dict[str, str]:
        """
        Get instructions for obtaining API keys for different services
        
        Returns:
            Dict[str, str]: API key instructions
        """
        return {
            'openweathermap': {
                'url': 'https://openweathermap.org/api',
                'instructions': 'Sign up for free account, get API key from dashboard',
                'free_tier': '1000 calls/day',
                'use_case': 'Weather data, forecasts, historical data'
            },
            'sentinel_hub': {
                'url': 'https://www.sentinel-hub.com/',
                'instructions': 'Create account, get API key from dashboard',
                'free_tier': 'Limited free tier available',
                'use_case': 'Sentinel satellite imagery, NDVI, land cover'
            },
            'noaa': {
                'url': 'https://www.ncdc.noaa.gov/cdo-web/token',
                'instructions': 'Register for free token',
                'free_tier': '1000 calls/day',
                'use_case': 'Climate data, weather stations, historical data'
            },
            'copernicus': {
                'url': 'https://scihub.copernicus.eu/dhus/#/self-registration',
                'instructions': 'Register for free account',
                'free_tier': 'Unlimited access to Sentinel data',
                'use_case': 'Sentinel-1, Sentinel-2, Sentinel-3 satellite data'
            }
        }

def main():
    """Main function to demonstrate alternative data sources integration"""
    print("🌍 ORUN.IO Alternative Data Sources Integration Test")
    print("=" * 60)
    
    # Initialize Alternative Data Sources
    alt_data = AlternativeDataSources()
    
    # Get API key instructions
    print("🔑 API Key Instructions:")
    api_instructions = alt_data.get_api_key_instructions()
    for service, info in api_instructions.items():
        print(f"\n📋 {service.upper()}:")
        print(f"   URL: {info['url']}")
        print(f"   Instructions: {info['instructions']}")
        print(f"   Free Tier: {info['free_tier']}")
        print(f"   Use Case: {info['use_case']}")
    
    # Test World Bank data (no API key required)
    print("\n🌍 Testing World Bank API (no API key required)...")
    world_bank_data = alt_data.get_world_bank_data('KE')  # Kenya
    if world_bank_data:
        print(f"✅ World Bank data retrieved: {len(world_bank_data)} indicators")
        for indicator, data in world_bank_data.items():
            if data and len(data) > 0:
                print(f"   - {indicator}: {len(data)} data points")
    else:
        print("❌ World Bank data retrieval failed")
    
    # Test OpenStreetMap data (no API key required)
    print("\n🗺️ Testing OpenStreetMap API (no API key required)...")
    osm_data = alt_data.get_openstreetmap_data(-1.2921, 36.8219)  # Nairobi
    if osm_data:
        print(f"✅ OpenStreetMap data retrieved")
        print(f"   Data type: {type(osm_data)}")
    else:
        print("❌ OpenStreetMap data retrieval failed")
    
    # Test comprehensive Africa data
    print("\n🌍 Testing comprehensive Africa data...")
    africa_data = alt_data.get_comprehensive_africa_data('kenya')
    if africa_data:
        print(f"✅ Comprehensive data retrieved for {africa_data['country']}")
        print(f"   Data sources: {list(africa_data['data_sources'].keys())}")
        print(f"   API keys required: {len(africa_data['data_sources'].get('api_keys_required', []))}")
    else:
        print("❌ Comprehensive Africa data retrieval failed")
    
    # Test ORUN.IO pilot regions alternative data
    print("\n🎯 Testing ORUN.IO pilot regions alternative data...")
    pilot_data = alt_data.get_orun_pilot_alternative_data()
    print(f"✅ Pilot regions processed: {len(pilot_data)}")
    
    for region_key, region_data in pilot_data.items():
        region_name = region_data['region_info']['name']
        data_sources = list(region_data['data_sources'].keys())
        print(f"   - {region_name}: {', '.join(data_sources)}")
    
    print("\n🚀 Alternative data sources integration test completed!")
    print("🌍 ORUN.IO now has access to multiple alternative data sources!")
    print("\n📋 Next Steps:")
    print("1. Obtain API keys for weather and satellite data services")
    print("2. Integrate OpenWeatherMap for weather data")
    print("3. Integrate Sentinel Hub for satellite imagery")
    print("4. Integrate NOAA for climate data")
    print("5. Integrate Copernicus for Sentinel satellite data")

if __name__ == "__main__":
    main()

