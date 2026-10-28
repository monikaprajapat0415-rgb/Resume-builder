import csv
from collections import defaultdict
from pathlib import Path

here = Path(__file__).parent
totals = defaultdict(float)
biggest = None

with open(here / "expenses.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        amount = float(row["amount"])
        totals[row["category"]] += amount
        if biggest is None or amount > biggest["amount"]:
            biggest = {"description": row["description"], "amount": amount}

grand_total = sum(totals.values())
print(f"{'Category':<10}{'Total':>10}{'Share':>8}")
for category, total in sorted(totals.items(), key=lambda item: item[1], reverse=True):
    print(f"{category:<10}{total:>10.2f}{total / grand_total:>8.0%}")
print(f"{'All':<10}{grand_total:>10.2f}")
print("Biggest:", biggest["description"], biggest["amount"])
