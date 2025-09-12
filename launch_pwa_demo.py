#!/usr/bin/env python3
"""
ORUN.IO PWA Demo Launcher
Serves the enhanced demo with proper PWA headers and HTTPS support
"""

import http.server
import socketserver
import ssl
import os
import sys
import webbrowser
import threading
import time
from pathlib import Path

class PWAHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler with PWA-optimized headers"""
    
    def end_headers(self):
        # Add PWA-required headers
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Resource-Policy', 'cross-origin')
        
        # Security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        
        # Cache headers for better performance
        if self.path.endswith(('.js', '.css', '.woff2', '.woff')):
            self.send_header('Cache-Control', 'public, max-age=31536000')
        elif self.path.endswith(('.html', '.json')):
            self.send_header('Cache-Control', 'no-cache')
        
        # Service Worker headers
        if self.path.endswith('sw.js'):
            self.send_header('Service-Worker-Allowed', '/')
            self.send_header('Cache-Control', 'no-cache')
        
        super().end_headers()
    
    def guess_type(self, path):
        """Override to set correct MIME types for PWA files"""
        mimetype, encoding = super().guess_type(path)
        
        if path.endswith('.webmanifest'):
            return 'application/manifest+json'
        elif path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        
        return mimetype

def create_self_signed_cert():
    """Create a self-signed certificate for HTTPS"""
    try:
        from cryptography import x509
        from cryptography.x509.oid import NameOID
        from cryptography.hazmat.primitives import hashes, serialization
        from cryptography.hazmat.primitives.asymmetric import rsa
        import datetime
        
        # Generate private key
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
        )
        
        # Create certificate
        subject = issuer = x509.Name([
            x509.NameAttribute(NameOID.COUNTRY_NAME, "US"),
            x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "California"),
            x509.NameAttribute(NameOID.LOCALITY_NAME, "San Francisco"),
            x509.NameAttribute(NameOID.ORGANIZATION_NAME, "ORUN.IO"),
            x509.NameAttribute(NameOID.COMMON_NAME, "localhost"),
        ])
        
        cert = x509.CertificateBuilder().subject_name(
            subject
        ).issuer_name(
            issuer
        ).public_key(
            private_key.public_key()
        ).serial_number(
            x509.random_serial_number()
        ).not_valid_before(
            datetime.datetime.utcnow()
        ).not_valid_after(
            datetime.datetime.utcnow() + datetime.timedelta(days=365)
        ).add_extension(
            x509.SubjectAlternativeName([
                x509.DNSName("localhost"),
                x509.IPAddress("127.0.0.1"),
            ]),
            critical=False,
        ).sign(private_key, hashes.SHA256())
        
        # Write certificate and key
        with open("cert.pem", "wb") as f:
            f.write(cert.public_bytes(serialization.Encoding.PEM))
        
        with open("key.pem", "wb") as f:
            f.write(private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            ))
        
        return True
    except ImportError:
        print("⚠️  cryptography library not available. Using HTTP instead of HTTPS.")
        return False

def launch_server(port=8000, use_https=True):
    """Launch the PWA demo server"""
    
    # Check if we're in the right directory
    if not os.path.exists('insane_demo.html'):
        print("❌ Error: insane_demo.html not found!")
        print("Please run this script from the ORUN.IO directory.")
        sys.exit(1)
    
    # Create HTTPS certificate if needed
    if use_https and not os.path.exists('cert.pem'):
        print("🔐 Creating self-signed certificate for HTTPS...")
        if not create_self_signed_cert():
            use_https = False
    
    # Set up server
    handler = PWAHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            if use_https and os.path.exists('cert.pem'):
                # Wrap with SSL
                context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
                context.load_cert_chain('cert.pem', 'key.pem')
                httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
                protocol = "https"
            else:
                protocol = "http"
            
            print(f"""
🚀 ORUN.IO PWA Demo Server Starting...

📍 Server: {protocol}://localhost:{port}
🌐 PWA Features: ✅ Enabled
🔐 HTTPS: {'✅ Enabled' if use_https else '❌ Disabled (HTTP only)'}
📱 Installable: ✅ Yes
🔄 Service Worker: ✅ Active
⚡ Performance: ✅ Optimized

🎯 Features Available:
   • Progressive Web App (PWA)
   • Offline capability
   • Install prompt
   • Real-time performance monitoring
   • Modern Web APIs (IntersectionObserver, ResizeObserver)
   • Device-adaptive graphics
   • CGI-quality 3D icons
   • Advanced particle system

📱 To install as PWA:
   1. Open in Chrome/Edge
   2. Look for install button or menu option
   3. Click "Install ORUN.IO"

🛑 Press Ctrl+C to stop server
            """)
            
            # Open browser after a short delay
            def open_browser():
                time.sleep(1)
                url = f"{protocol}://localhost:{port}/insane_demo.html"
                print(f"🌐 Opening browser: {url}")
                webbrowser.open(url)
            
            threading.Thread(target=open_browser, daemon=True).start()
            
            # Start server
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {port} is already in use. Try a different port:")
            print(f"   python launch_pwa_demo.py --port {port + 1}")
        else:
            print(f"❌ Error starting server: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def main():
    """Main function with argument parsing"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Launch ORUN.IO PWA Demo Server')
    parser.add_argument('--port', type=int, default=8000, help='Port to serve on (default: 8000)')
    parser.add_argument('--http', action='store_true', help='Use HTTP instead of HTTPS')
    
    args = parser.parse_args()
    
    launch_server(port=args.port, use_https=not args.http)

if __name__ == "__main__":
    main()
