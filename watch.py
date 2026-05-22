import os
import time
import subprocess
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(SCRIPT_DIR, "data.md")
TEMPLATE_PATH = os.path.join(SCRIPT_DIR, "template.html")
BUILD_PATH = os.path.join(SCRIPT_DIR, "build.py")

print("====================================================")
print("Creator Portfolio: Python File Watcher")
print("====================================================")
print("Watching for changes in:")
print("  - data.md")
print("  - template.html")
print("\nAny edits will automatically compile and update index.html in real-time!")
print("Press Ctrl+C to stop watching.\n")

def run_build():
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] File change detected! Compiling...")
    try:
        result = subprocess.run(["python", BUILD_PATH], capture_output=True, text=True, check=True)
        print(f"[{timestamp}] SUCCESS: Build succeeded! index.html updated successfully.\n")
    except subprocess.CalledProcessError as e:
        print(f"[{timestamp}] ERROR: Build failed:\n{e.stderr or e.stdout}\n")
    except Exception as e:
        print(f"[{timestamp}] ERROR: Error running build script: {str(e)}\n")

def get_mtimes():
    data_mtime = os.path.getmtime(DATA_PATH) if os.path.exists(DATA_PATH) else 0
    tmpl_mtime = os.path.getmtime(TEMPLATE_PATH) if os.path.exists(TEMPLATE_PATH) else 0
    return data_mtime, tmpl_mtime

# Initial compilation
run_build()

last_data_mtime, last_tmpl_mtime = get_mtimes()

try:
    while True:
        time.sleep(0.3)
        curr_data_mtime, curr_tmpl_mtime = get_mtimes()
        
        if curr_data_mtime != last_data_mtime or curr_tmpl_mtime != last_tmpl_mtime:
            run_build()
            last_data_mtime, last_tmpl_mtime = curr_data_mtime, curr_tmpl_mtime
except KeyboardInterrupt:
    print("\nStopped watching files. Have a great day building!")
