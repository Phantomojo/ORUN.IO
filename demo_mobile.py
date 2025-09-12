#!/usr/bin/env python3
"""
ORUN.IO Mobile Earth Visualization Demo
Optimized for phones and tablets with touch controls
"""

import webbrowser
import time
import os
import sys

def print_banner():
    print("=" * 80)
    print("📱 ORUN.IO MOBILE EARTH VISUALIZATION 📱")
    print("=" * 80)
    print("🌍 Optimized for phones and tablets")
    print("👆 Touch controls and gestures")
    print("⚡ Lightweight Three.js engine")
    print("🚀 No external dependencies required")
    print("=" * 80)
    print()

def check_file():
    """Check if the mobile Earth HTML file exists"""
    mobile_file = "mobile_earth.html"
    if not os.path.exists(mobile_file):
        print(f"❌ Error: {mobile_file} not found!")
        print("Please make sure the file exists in the current directory.")
        return False
    return True

def launch_mobile_earth():
    """Launch the mobile-optimized Earth visualization"""
    print("📱 Initializing Mobile Earth Visualization...")
    print("🌍 Loading Three.js engine...")
    print("👆 Setting up touch controls...")
    print("⚡ Optimizing for mobile performance...")
    print("🎨 Rendering responsive UI...")
    print()
    
    # Get the absolute path to the HTML file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    mobile_file = os.path.join(current_dir, "mobile_earth.html")
    
    print(f"🚀 Launching: {mobile_file}")
    print()
    
    try:
        # Open in default browser
        webbrowser.open(f"file://{mobile_file}")
        print("✅ Mobile Earth visualization launched successfully!")
        print()
        print("📱 MOBILE FEATURES:")
        print("   • Touch and drag to rotate Earth")
        print("   • Pinch to zoom (on supported devices)")
        print("   • Touch controls for zoom in/out")
        print("   • Reset view button")
        print("   • Responsive UI that adapts to screen size")
        print("   • Optimized performance for mobile devices")
        print("   • No external API dependencies")
        print()
        print("🌍 EARTH FEATURES:")
        print("   • High-quality 3D Earth with continents")
        print("   • Orbiting satellites with scanning beams")
        print("   • Realistic lighting and atmosphere")
        print("   • African project markers")
        print("   • Floating coordinate text")
        print("   • Smooth 60fps animations")
        print()
        print("🎮 CONTROLS:")
        print("   • Touch/Drag: Rotate Earth")
        print("   • + Button: Zoom in")
        print("   • - Button: Zoom out")
        print("   • ⌂ Button: Reset view")
        print("   • Pinch: Zoom (mobile browsers)")
        print()
        print("📱 COMPATIBILITY:")
        print("   • iOS Safari")
        print("   • Android Chrome")
        print("   • Mobile Firefox")
        print("   • Desktop browsers")
        print("   • Tablets and phones")
        print()
        print("Press Ctrl+C to exit...")
        
        # Keep the script running
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n👋 Thanks for exploring ORUN.IO's mobile Earth visualization!")
            
    except Exception as e:
        print(f"❌ Error launching visualization: {e}")
        return False
    
    return True

def main():
    """Main function"""
    print_banner()
    
    if not check_file():
        sys.exit(1)
    
    print("🎯 This mobile demo showcases:")
    print("   • Phone-optimized 3D Earth rendering")
    print("   • Touch controls and gestures")
    print("   • Responsive design for all screen sizes")
    print("   • No external API dependencies")
    print("   • Fast loading and smooth performance")
    print()
    
    input("Press Enter to launch the mobile Earth visualization...")
    print()
    
    if launch_mobile_earth():
        print("🎉 Mobile demo completed successfully!")
    else:
        print("❌ Mobile demo failed to launch.")
        sys.exit(1)

if __name__ == "__main__":
    main()
