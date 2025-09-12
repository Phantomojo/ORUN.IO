#!/usr/bin/env python3
"""
ORUN.IO CesiumJS Earth Visualization Server
Serves the CesiumJS application with proper CORS headers
"""

import http.server
import socketserver
import webbrowser
import threading
import time
import os
import sys

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def print_banner():
    print("=" * 80)
    print("🌍 ORUN.IO CESIUMJS EARTH SERVER 🌍")
    print("=" * 80)
    print("🚀 Professional 3D Globe with Web Server")
    print("🛰️ Real-time satellite monitoring across Africa")
    print("📊 Climate impact verification platform")
    print("=" * 80)
    print()

def start_server():
    """Start the HTTP server"""
    PORT = 8000
    
    # Change to the directory containing the HTML file
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), CORSHTTPRequestHandler) as httpd:
        print(f"🌍 Server running at http://localhost:{PORT}")
        print(f"🚀 CesiumJS Earth visualization: http://localhost:{PORT}/cesium_earth.html")
        print("📱 Mobile version: http://localhost:{PORT}/mobile_earth.html")
        print("🎨 Awwwards version: http://localhost:{PORT}/insane_demo.html")
        print()
        print("Press Ctrl+C to stop the server...")
        print()
        
        # Open browser after a short delay
        def open_browser():
            time.sleep(2)
            webbrowser.open(f'http://localhost:{PORT}/cesium_earth.html')
        
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True
        browser_thread.start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped. Thanks for exploring ORUN.IO!")
            httpd.shutdown()

def main():
    """Main function"""
    print_banner()
    
    # Check if cesium_earth.html exists
    if not os.path.exists("cesium_earth.html"):
        print("❌ Error: cesium_earth.html not found!")
        print("Please make sure the file exists in the current directory.")
        sys.exit(1)
    
    print("🎯 Starting web server for CesiumJS Earth visualization...")
    print("   • Professional 3D globe with satellite imagery")
    print("   • Real-time satellite monitoring")
    print("   • African project markers")
    print("   • Mobile-optimized interface")
    print()
    
    input("Press Enter to start the server...")
    print()
    
    start_server()

if __name__ == "__main__":
    main()
