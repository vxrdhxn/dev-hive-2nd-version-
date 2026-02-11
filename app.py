#!/usr/bin/env python3
"""
KTP - Knowledge Transfer Platform
Main Application Launcher
Combines Flask Backend and React Frontend
"""

import os
import threading
import time
import subprocess
import sys
import webbrowser
from pathlib import Path

def start_flask_backend():
    """Start Flask backend"""
    print("📡 Starting Flask backend...")
    
    # Run server/app.py directly
    server_path = Path("server/app.py").absolute()
    
    try:
        subprocess.run([sys.executable, str(server_path)], cwd="server", check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Backend failed with error code {e.returncode}")
    except KeyboardInterrupt:
        print("\n🛑 Backend stopped")

def start_react_frontend():
    """Start React frontend"""
    print("🎨 Starting React frontend...")
    
    # Run npm run dev in frontend directory
    frontend_path = Path("frontend").absolute()
    
    try:
        # Use shell=True for Windows to find npm
        subprocess.run(["npm", "run", "dev", "--", "--open"], cwd="frontend", shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Frontend failed with error code {e.returncode}")
    except KeyboardInterrupt:
        print("\n🛑 Frontend stopped")

def main():
    print("🧠 KTP - Knowledge Transfer Platform")
    print("🚀 Starting Application...")
    
    # Check if we're in the right directory
    if not Path("server").exists() or not Path("frontend").exists():
        print("❌ Error: Please run this from the project root directory")
        sys.exit(1)
    
    # Start Backend in a separate thread
    backend_thread = threading.Thread(target=start_flask_backend, daemon=True)
    backend_thread.start()
    
    # Give backend a moment to initialize
    time.sleep(2)
    
    # Start Frontend (main thread)
    try:
        start_react_frontend()
    except KeyboardInterrupt:
        print("\n👋 Shutting down...")

if __name__ == "__main__":
    main()