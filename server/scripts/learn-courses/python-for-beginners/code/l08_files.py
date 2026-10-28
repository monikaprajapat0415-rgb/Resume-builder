import csv
import json
from pathlib import Path

folder = Path("data_demo")
folder.mkdir(exist_ok=True)

# Text file
notes = folder / "notes.txt"
notes.write_text("first line\nsecond line\n", encoding="utf-8")
with open(notes, encoding="utf-8") as f:
    for number, line in enumerate(f, start=1):
        print(number, line.strip())

# Append
with open(notes, "a", encoding="utf-8") as f:
    f.write("third line\n")
print(len(notes.read_text(encoding="utf-8").splitlines()), "lines now")

# CSV
rows = [
    {"date": "2026-01-05", "category": "Food", "amount": 250},
    {"date": "2026-01-06", "category": "Travel", "amount": 120},
]
csv_file = folder / "expenses.csv"
with open(csv_file, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["date", "category", "amount"])
    writer.writeheader()
    writer.writerows(rows)

with open(csv_file, newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row["category"], int(row["amount"]))

# JSON
settings = {"currency": "INR", "budget": 5000, "tags": ["home", "work"]}
json_file = folder / "settings.json"
json_file.write_text(json.dumps(settings, indent=2), encoding="utf-8")
loaded = json.loads(json_file.read_text(encoding="utf-8"))
print(loaded["budget"], loaded["tags"])

print(sorted(p.name for p in folder.iterdir()))
print(Path("missing.txt").exists())

import shutil
shutil.rmtree(folder)
