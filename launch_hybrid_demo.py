#!/usr/bin/env python3
"""
ORUN.IO Hybrid Demo Launcher
Launches the 2050.earth inspired design while React app is being fixed
"""

import webbrowser
import time
import os
import sys

def print_banner():
    print("=" * 80)
    print("🌍 ORUN.IO HYBRID DEMO LAUNCHER 🌍")
    print("=" * 80)
    print("🚀 2050.earth inspired design with 3D Earth")
    print("🛰️ Climate impact verification platform")
    print("📊 Modern UI with project feed and categories")
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

def launch_hybrid_demo():
    """Launch the 2050.earth inspired visualization"""
    print("🌍 Launching Hybrid Demo...")
    print("🎨 Loading 2050.earth inspired design...")
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
        print("✅ Hybrid demo launched successfully!")
        print()
        print("🎯 FEATURES:")
        print("   • 2050.earth inspired futuristic design")
        print("   • Modern glassmorphism UI elements")
        print("   • 3D Earth with African continent focus")
        print("   • Project feed with real African initiatives")
        print("   • Category-based data organization")
        print("   • Responsive design for all devices")
        print("   • Smooth scroll animations with GSAP")
        print()
        print("🌍 EARTH FEATURES:")
        print("   • Three.js 3D Earth with custom textures")
        print("   • African continent highlighted")
        print("   • Smooth rotation animation")
        print("   • Subtle background integration")
        print()
        print("📊 PROJECT SHOWCASE:")
        print("   • Makueni Sand Dams (Kenya)")
        print("   • Niger Delta Restoration (Nigeria)")
        print("   • Okavango Water Management (Botswana)")
        print("   • Kilimanjaro Reforestation (Tanzania)")
        print("   • Coastal Protection System (Benin)")
        print("   • Solar Energy Grid (Ghana)")
        print()
        print("🎨 DESIGN ELEMENTS:")
        print("   • Fixed navigation header")
        print("   • Language selector (EN/FR)")
        print("   • Call-to-action buttons")
        print("   • Category grid with project counts")
        print("   • Professional footer")
        print("   • Floating UI elements")
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
            print("\n👋 Thanks for exploring ORUN.IO's hybrid demo!")
            
    except Exception as e:
        print(f"❌ Error launching demo: {e}")
        return False
    
    return True

def main():
    """Main function"""
    print_banner()
    
    if not check_file():
        sys.exit(1)
    
    print("🎯 This hybrid demo showcases:")
    print("   • 2050.earth inspired futuristic design")
    print("   • Modern climate impact verification platform")
    print("   • 3D Earth visualization with African focus")
    print("   • Project feed with real African initiatives")
    print("   • Responsive design for all devices")
    print()
    print("💡 Note: This is the HTML version while we fix the React app")
    print()
    
    input("Press Enter to launch the hybrid demo...")
    print()
    
    if launch_hybrid_demo():
        print("🎉 Hybrid demo completed successfully!")
    else:
        print("❌ Hybrid demo failed to launch.")
        sys.exit(1)

if __name__ == "__main__":
    main()
