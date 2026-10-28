import shutil
from pathlib import Path

# Make a practice folder with some untidy files
folder = Path("downloads_demo")
folder.mkdir(exist_ok=True)
for name in ["cv.pdf", "photo1.jpg", "photo2.JPG", "notes.txt", "budget.xlsx", "report.pdf", "README"]:
    (folder / name).write_text("demo", encoding="utf-8")

groups = {
    ".pdf": "documents", ".txt": "documents",
    ".jpg": "images", ".png": "images",
    ".xlsx": "spreadsheets",
}

for item in sorted(folder.iterdir()):
    if not item.is_file():
        continue
    target_name = groups.get(item.suffix.lower())
    if target_name is None:
        print("Left alone:", item.name)
        continue
    target = folder / target_name
    target.mkdir(exist_ok=True)
    destination = target / item.name.lower()
    if destination.exists():
        print("Skipped (exists):", item.name)
        continue
    shutil.move(str(item), destination)
    print(f"Moved {item.name} -> {target_name}/")

for path in sorted(folder.rglob("*")):
    print(path.relative_to(folder))

shutil.rmtree(folder)
