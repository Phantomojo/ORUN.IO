#!/usr/bin/env python3
"""
ORUN.IO 2050.earth Style Demo
Inspired by the futuristic design of 2050.earth but tailored for climate impact verification
"""

import webbrowser
import time
import os
import sys

def print_banner():
    print("=" * 80)
    print("🌍 ORUN.IO 2050.EARTH STYLE DEMO 🌍")
    print("=" * 80)
    print("🚀 Futuristic design inspired by 2050.earth")
    print("🛰️ Climate impact verification platform")
    print("📊 Modern UI with 3D Earth visualization")
    print("=" * 80)
    print()

def check_file():
    """Check if the 2050 style HTML file exists"""
    style_file = "orun_2050_style.html"
    if not os.path.exists(style_file):
        print(f"❌ Error: {style_file} not found!")
        print("Please make sure the file exists in the current directory.")
        return False
    return True

def launch_2050_style():
    """Launch the 2050.earth inspired visualization"""
    print("🌍 Launching 2050.earth Style Visualization...")
    print("🎨 Loading futuristic design elements...")
    print("🛰️ Initializing 3D Earth...")
    print("📊 Setting up project feed...")
    print("✨ Applying modern animations...")
    print()
    
    # Get the absolute path to the HTML file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    style_file = os.path.join(current_dir, "orun_2050_style.html")
    
    print(f"🚀 Launching: {style_file}")
    print()
    
    try:
        # Open in default browser
        webbrowser.open(f"file://{style_file}")
        print("✅ 2050.earth Style visualization launched successfully!")
        print()
        print("🎯 DESIGN FEATURES:")
        print("   • Futuristic 2050.earth inspired layout")
        print("   • Modern glassmorphism design")
        print("   • Clean typography with Inter and Space Grotesk fonts")
        print("   • Gradient text effects and animations")
        print("   • Responsive grid layouts")
        print("   • Smooth scroll animations with GSAP")
        print()
        print("🌍 EARTH FEATURES:")
        print("   • 3D Earth with custom textures")
        print("   • African continent highlighted")
        print("   • Smooth rotation animation")
        print("   • Subtle background integration")
        print()
        print("📊 PROJECT FEED:")
        print("   • Grid-based project showcase")
        print("   • Year and location metadata")
        print("   • Hover effects and animations")
        print("   • Category-based organization")
        print()
        print("🎨 UI ELEMENTS:")
        print("   • Fixed navigation header")
        print("   • Language selector (EN/FR)")
        print("   • Call-to-action buttons")
        print("   • Category grid with counts")
        print("   • Professional footer")
        print()
        print("📱 RESPONSIVE DESIGN:")
        print("   • Mobile-first approach")
        print("   • Adaptive layouts")
        print("   • Touch-friendly interactions")
        print("   • Optimized for all screen sizes")
        print()
        print("Press Ctrl+C to exit...")
        
        # Keep the script running
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n👋 Thanks for exploring ORUN.IO's futuristic design!")
            
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
    print("   • 2050.earth inspired futuristic design")
    print("   • Modern climate impact verification platform")
    print("   • 3D Earth visualization with African focus")
    print("   • Project feed with real African initiatives")
    print("   • Responsive design for all devices")
    print()
    
    input("Press Enter to launch the 2050.earth style visualization...")
    print()
    
    if launch_2050_style():
        print("🎉 2050.earth style demo completed successfully!")
    else:
        print("❌ 2050.earth style demo failed to launch.")
        sys.exit(1)

if __name__ == "__main__":
    main()
