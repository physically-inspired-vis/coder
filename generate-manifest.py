"""
Run this script whenever you add/remove files from the examples/ folder:
    python generate-manifest.py
It writes examples/manifest.json used by the dropdown in the coding interface.
"""

import json
import os

EXAMPLES_DIR = os.path.join(os.path.dirname(__file__), "examples")
OUTPUT_FILE = os.path.join(EXAMPLES_DIR, "manifest.json")

entries = []

for filename in sorted(os.listdir(EXAMPLES_DIR)):
    if not filename.endswith(".json") or filename == "manifest.json":
        continue

    filepath = os.path.join(EXAMPLES_DIR, filename)
    try:
        with open(filepath, encoding="utf-8") as f:
            data = json.load(f)
        entry = {
            "id": str(data.get("id", "")).strip(),
            "title": str(data.get("title", filename)).strip(),
            "file": f"examples/{filename}",
        }
        entries.append(entry)
        print(f"  OK  {entry['id']:>4}  {entry['title']}")
    except Exception as e:
        print(f"  ERR  {filename}: {e}")

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(entries, f, indent=2, ensure_ascii=False)

print(f"\nWrote {len(entries)} entries to examples/manifest.json")
