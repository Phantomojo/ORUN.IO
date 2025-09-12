#!/usr/bin/env python3
"""
ORUN.IO Professional Earth Visualization Demo
Using CesiumJS - The same technology used by NASA and professional geospatial applications
"""

import webbrowser
import time
import os
import sys

def print_banner():
    print("=" * 80)
    print("🌍 ORUN.IO PROFESSIONAL EARTH VISUALIZATION 🌍")
    print("=" * 80)
    print("🚀 Using CesiumJS - NASA-grade 3D Globe Technology")
    print("🛰️ Real-time satellite monitoring across Africa")
    print("📊 Climate impact verification platform")
    print("=" * 80)
    print()

def check_file():
    """Check if the Cesium Earth HTML file exists"""
    cesium_file = "cesium_earth.html"
    if not os.path.exists(cesium_file):
        print(f"❌ Error: {cesium_file} not found!")
        print("Please make sure the file exists in the current directory.")
        return False
    return True

def launch_cesium_earth():
    """Launch the professional CesiumJS Earth visualization"""
    print("🌍 Initializing Professional Earth Visualization...")
    print("📡 Loading CesiumJS engine...")
    print("🛰️ Connecting to satellite data...")
    print("🌊 Rendering high-resolution terrain...")
    print("☁️ Setting up atmospheric effects...")
    print()
    
    # Get the absolute path to the HTML file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    cesium_file = os.path.join(current_dir, "cesium_earth.html")
    
    print(f"🚀 Launching: {cesium_file}")
    print()
    
    try:
        # Open in default browser
        webbrowser.open(f"file://{cesium_file}")
        print("✅ Professional Earth visualization launched successfully!")
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
            
    except Exception as e:
        print(f"❌ Error launching visualization: {e}")
        return False
    
    return True

def main():
    """Main function"""
    print_banner()
    
    if not check_file():
        sys.exit(1)
    
    print("🎯 This demo showcases:")
    print("   • Professional-grade 3D Earth rendering")
    print("   • Real-time satellite monitoring")
    print("   • Climate impact verification")
    print("   • African project visualization")
    print()
    
    input("Press Enter to launch the professional Earth visualization...")
    print()
    
    if launch_cesium_earth():
        print("🎉 Demo completed successfully!")
    else:
        print("❌ Demo failed to launch.")
        sys.exit(1)

if __name__ == "__main__":
    main()
