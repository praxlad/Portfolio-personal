import os
import shutil

# Path Constants
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_INDEX = os.path.join(SCRIPT_DIR, "index.html")
SRC_STYLE = os.path.join(SCRIPT_DIR, "style.css")
SRC_APP = os.path.join(SCRIPT_DIR, "app.js")

DST_DIR = os.path.join(SCRIPT_DIR, "projects", "portfolio-o")
DST_INDEX = os.path.join(DST_DIR, "index.html")
DST_STYLE = os.path.join(DST_DIR, "style.css")
DST_APP = os.path.join(DST_DIR, "app.js")

# Create target directory
os.makedirs(DST_DIR, exist_ok=True)

# Copy stylesheet and script
print(f"Copying style.css to {DST_STYLE}...")
shutil.copy2(SRC_STYLE, DST_STYLE)

print(f"Copying app.js to {DST_APP}...")
shutil.copy2(SRC_APP, DST_APP)

# Read, process and write index.html
print(f"Compiling nested index.html to {DST_INDEX}...")
with open(SRC_INDEX, "r", encoding="utf-8") as f:
    content = f.read()

# Replace project links with relative links going up one directory level
processed_content = content.replace('href="projects/', 'href="../')

with open(DST_INDEX, "w", encoding="utf-8") as f:
    f.write(processed_content)

print("Nested Portfolio-O project compiled successfully!")
