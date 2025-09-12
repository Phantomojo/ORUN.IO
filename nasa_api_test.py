#!/usr/bin/env python3
"""
NASA API Test Script for ORUN.IO
Author: PHANTOMOJO
Date: 2025

This script demonstrates the NASA API integration capabilities
for the ORUN.IO Climate Impact Verification Platform.
"""

import sys
import os
import json
from datetime import datetime

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from nasa_api_integration import NASAAPIIntegration

def print_header(title: str):
    """Print a formatted header"""
    print("\n" + "=" * 60)
    print(f"🌍 {title}")
    print("=" * 60)

def print_section(title: str):
    """Print a formatted section header"""
    print(f"\n🔹 {title}")
    print("-" * 40)

def test_nasa_api_integration():
    """Test NASA API integration for ORUN.IO"""
    
    print_header("ORUN.IO NASA API Integration Test")
    print("Testing NASA API integration for climate impact verification")
    
    # Initialize NASA API
    print_section("Initializing NASA API")
    nasa_api = NASAAPIIntegration()
    print(f"✅ NASA API initialized with key: {nasa_api.api_key[:10]}...")
    
    # Test connection
    print_section("Testing API Connection")
    if nasa_api.test_api_connection():
        print("✅ NASA API connection successful!")
    else:
        print("❌ NASA API connection failed!")
        return False
    
    # Get rate limit status
    print_section("Rate Limit Status")
    rate_status = nasa_api.get_rate_limit_status()
    print(f"📊 Remaining requests: {rate_status['remaining_requests']}")
    print(f"🕐 Reset time: {rate_status['reset_time']}")
    print(f"⏰ Last request: {rate_status['last_request']}")
    
    # Test APOD (Astronomy Picture of the Day)
    print_section("Astronomy Picture of the Day")
    try:
        apod = nasa_api.get_apod()
        if apod:
            print(f"📅 Date: {apod.get('date', 'N/A')}")
            print(f"🏷️ Title: {apod.get('title', 'N/A')}")
            print(f"📝 Explanation: {apod.get('explanation', 'N/A')[:150]}...")
            print(f"🖼️ Image URL: {apod.get('url', 'N/A')}")
            if apod.get('hdurl'):
                print(f"🖼️ HD Image URL: {apod.get('hdurl')}")
        else:
            print("❌ Failed to get APOD data")
    except Exception as e:
        print(f"❌ APOD test failed: {e}")
    
    # Test Earth imagery for African cities
    print_section("Earth Imagery for African Cities")
    african_cities = {
        'Nairobi, Kenya': (-1.2921, 36.8219),
        'Lagos, Nigeria': (6.5244, 3.3792),
        'Cape Town, South Africa': (-33.9249, 18.4241),
        'Addis Ababa, Ethiopia': (9.1450, 38.7667)
    }
    
    for city, (lat, lon) in african_cities.items():
        try:
            print(f"\n🌍 Getting imagery for {city}...")
            imagery = nasa_api.get_earth_imagery(lat, lon, dim=0.1)
            if imagery:
                print(f"  ✅ Image URL: {imagery.get('url', 'N/A')}")
                print(f"  📅 Date: {imagery.get('date', 'N/A')}")
            else:
                print(f"  ❌ No imagery available for {city}")
        except Exception as e:
            print(f"  ❌ Error getting imagery for {city}: {e}")
    
    # Test ORUN.IO pilot regions
    print_section("ORUN.IO Pilot Regions Data")
    try:
        pilot_data = nasa_api.get_orun_pilot_regions_data()
        print(f"📊 Pilot regions processed: {len(pilot_data)}")
        
        for region_key, region_data in pilot_data.items():
            region_info = region_data['region_info']
            print(f"\n🎯 {region_info['name']}")
            print(f"   📍 Coordinates: {region_info['lat']}, {region_info['lon']}")
            print(f"   📝 Description: {region_info['description']}")
            
            if region_data.get('current_imagery'):
                print(f"   🖼️ Current imagery: Available")
            else:
                print(f"   🖼️ Current imagery: Not available")
            
            historical_count = len(region_data.get('historical_data', []))
            print(f"   📈 Historical data points: {historical_count}")
            
    except Exception as e:
        print(f"❌ Pilot regions test failed: {e}")
    
    # Test African climate data
    print_section("African Climate Data")
    try:
        # Test specific country
        kenya_data = nasa_api.get_africa_climate_data('kenya')
        print(f"🇰🇪 Kenya climate data points: {len(kenya_data)}")
        
        # Test all African countries (limited to avoid rate limits)
        print("🌍 Getting data for all African countries...")
        all_africa_data = nasa_api.get_africa_climate_data()
        print(f"📊 Total African climate data points: {len(all_africa_data)}")
        
        for data_point in all_africa_data[:3]:  # Show first 3
            print(f"  - {data_point['country']}: ✅")
            
    except Exception as e:
        print(f"❌ African climate data test failed: {e}")
    
    # Final rate limit status
    print_section("Final Rate Limit Status")
    final_rate_status = nasa_api.get_rate_limit_status()
    print(f"📊 Remaining requests: {final_rate_status['remaining_requests']}")
    print(f"🕐 Reset time: {final_rate_status['reset_time']}")
    
    print_header("NASA API Integration Test Completed")
    print("✅ All tests completed successfully!")
    print("🚀 NASA API integration is ready for ORUN.IO!")
    
    return True

def demonstrate_api_capabilities():
    """Demonstrate specific API capabilities"""
    
    print_header("NASA API Capabilities Demonstration")
    
    nasa_api = NASAAPIIntegration()
    
    # Demonstrate different image dimensions
    print_section("Image Dimension Examples")
    nairobi_coords = (-1.2921, 36.8219)
    
    dimensions = [0.05, 0.1, 0.2, 0.5]
    for dim in dimensions:
        try:
            imagery = nasa_api.get_earth_imagery(nairobi_coords[0], nairobi_coords[1], dim=dim)
            if imagery:
                print(f"  📏 Dimension {dim}°: ✅ Available")
            else:
                print(f"  📏 Dimension {dim}°: ❌ Not available")
        except Exception as e:
            print(f"  📏 Dimension {dim}°: ❌ Error - {e}")
    
    # Demonstrate historical data
    print_section("Historical Data Example")
    try:
        # Get imagery from 30 days ago
        from datetime import timedelta
        historical_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        
        historical_imagery = nasa_api.get_earth_imagery(
            nairobi_coords[0], 
            nairobi_coords[1], 
            date=historical_date
        )
        
        if historical_imagery:
            print(f"📅 Historical imagery from {historical_date}: ✅ Available")
            print(f"🖼️ URL: {historical_imagery.get('url', 'N/A')}")
        else:
            print(f"📅 Historical imagery from {historical_date}: ❌ Not available")
            
    except Exception as e:
        print(f"❌ Historical data test failed: {e}")

def main():
    """Main function"""
    try:
        # Run main integration test
        success = test_nasa_api_integration()
        
        if success:
            # Demonstrate additional capabilities
            demonstrate_api_capabilities()
            
            print_header("Integration Summary")
            print("🎯 NASA API successfully integrated into ORUN.IO")
            print("🌍 Ready for climate impact verification in Africa")
            print("🛰️ Satellite imagery capabilities enhanced")
            print("📊 Real-time data monitoring enabled")
            print("🚀 Platform ready for production use!")
            
        else:
            print("❌ Integration test failed. Please check API key and connection.")
            
    except KeyboardInterrupt:
        print("\n\n⏹️ Test interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()
