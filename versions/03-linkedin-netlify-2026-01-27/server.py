#!/usr/bin/env python3
"""
Simple HTTP server for the LinkedIn dashboard
"""
import http.server
import socketserver
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_GET(self):
        # Serve the filtered dashboard as default
        if self.path == '/':
            self.path = '/linkedin-dashboard-filtered.html'
        return super().do_GET()

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 Server running at http://localhost:{PORT}")
        print(f"📊 Dashboard: http://localhost:{PORT}/")
        print(f"📊 Filtered Dashboard: http://localhost:{PORT}/linkedin-dashboard-filtered.html")
        print(f"📊 Auto Dashboard: http://localhost:{PORT}/linkedin-dashboard-auto.html")
        print(f"\nPress Ctrl+C to stop the server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n✓ Server stopped")
