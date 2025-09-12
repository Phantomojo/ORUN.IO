#!/usr/bin/env python3
"""
ORUN.IO CesiumJS Earth Visualization Launcher
Quick launcher for the CesiumJS Earth visualization
"""

import webbrowser
import time
import os
import sys

def print_banner():
    print("=" * 80)
    print("🌍 ORUN.IO CESIUMJS EARTH LAUNCHER 🌍")
    print("=" * 80)
    print("🚀 Professional 3D Globe with Web Server")
    print("🛰️ Real-time satellite monitoring across Africa")
    print("📊 Climate impact verification platform")
    print("=" * 80)
    print()

def launch_cesium():
    """Launch the CesiumJS Earth visualization"""
    print("🌍 Launching CesiumJS Earth Visualization...")
    print("📡 Using your Cesium Ion access token")
    print("🛰️ Loading professional satellite imagery...")
    print("🌊 Rendering high-resolution terrain...")
    print("☁️ Setting up atmospheric effects...")
    print()
    
    # Check if server is running
    import urllib.request
    try:
        urllib.request.urlopen('http://localhost:8000/cesium_earth.html', timeout=2)
        print("✅ Server is running at http://localhost:8000")
        print("🚀 Opening CesiumJS Earth visualization...")
        webbrowser.open('http://localhost:8000/cesium_earth.html')
        print()
        print("🎯 FEATURES:")
        print("   • NASA-grade CesiumJS 3D globe engine")
        print("   • High-resolution satellite imagery")
        print("   • Realistic atmospheric effects")
        print("   • Dynamic terrain rendering")
        print("   • Orbiting satellite simulation")
        print("   • African project markers")
        print("   • Real-time data visualization")
        print("   • Professional UI overlay")
        print()
        print("🌍 This is the same technology used by:")
        print("   • NASA WorldWind")
        print("   • Google Earth (similar quality)")
        print("   • Professional geospatial applications")
        print("   • Military and scientific organizations")
        print()
        print("🎮 CONTROLS:")
        print("   • Mouse: Rotate and zoom the Earth")
        print("   • Click: Interact with markers")
        print("   • Scroll: Zoom in/out")
        print()
        print("Press Ctrl+C to exit...")
        
        # Keep the script running
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n👋 Thanks for exploring ORUN.IO's professional Earth visualization!")
            
    except:
        print("❌ Server not running. Please start the server first:")
        print("   python3 -m http.server 8000")
        print("   or")
        print("   python3 cesium_server.py")
        return False
    
    return True

def main():
    """Main function"""
    print_banner()
    
    if not os.path.exists("cesium_earth.html"):
        print("❌ Error: cesium_earth.html not found!")
        print("Please make sure the file exists in the current directory.")
        sys.exit(1)
    
    print("🎯 This launcher will open:")
    print("   • Professional-grade 3D Earth rendering")
    print("   • Real-time satellite monitoring")
    print("   • Climate impact verification")
    print("   • African project visualization")
    print()
    
    input("Press Enter to launch the CesiumJS Earth visualization...")
    print()
    
    if launch_cesium():
        print("🎉 CesiumJS Earth visualization launched successfully!")
    else:
        print("❌ Failed to launch CesiumJS Earth visualization.")
        sys.exit(1)

if __name__ == "__main__":
    main()
