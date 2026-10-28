"""A small expense tracker for the command line.

Examples:
  python l15_tracker.py add 250 Food "Lunch"
  python l15_tracker.py list
  python l15_tracker.py total
"""
import argparse
import json
from pathlib import Path

DEFAULT_FILE = Path("expenses.json")


def load(file):
    try:
        return json.loads(Path(file).read_text(encoding="utf-8"))
    except FileNotFoundError:
        return []


def save(file, items):
    Path(file).write_text(json.dumps(items, indent=2), encoding="utf-8")


def add_expense(items, amount, category, note=""):
    if amount <= 0:
        raise ValueError("Amount must be more than zero")
    item = {"id": len(items) + 1, "amount": round(amount, 2), "category": category.title(), "note": note}
    items.append(item)
    return item


def totals_by_category(items):
    totals = {}
    for item in items:
        totals[item["category"]] = totals.get(item["category"], 0) + item["amount"]
    return dict(sorted(totals.items(), key=lambda pair: pair[1], reverse=True))


def build_parser():
    parser = argparse.ArgumentParser(description="Track your spending")
    parser.add_argument("--file", default=str(DEFAULT_FILE), help="where to keep the data")
    sub = parser.add_subparsers(dest="command", required=True)

    add = sub.add_parser("add", help="add an expense")
    add.add_argument("amount", type=float)
    add.add_argument("category")
    add.add_argument("note", nargs="?", default="")

    sub.add_parser("list", help="show all expenses")
    sub.add_parser("total", help="show totals by category")
    return parser


def main(argv=None):
    args = build_parser().parse_args(argv)
    items = load(args.file)

    if args.command == "add":
        try:
            item = add_expense(items, args.amount, args.category, args.note)
        except ValueError as error:
            print("Error:", error)
            return 1
        save(args.file, items)
        print(f"Saved #{item['id']}: {item['amount']:.2f} on {item['category']}")
    elif args.command == "list":
        if not items:
            print("No expenses yet")
        for item in items:
            print(f"{item['id']:>3}  {item['category']:<8}{item['amount']:>9.2f}  {item['note']}")
    elif args.command == "total":
        for category, total in totals_by_category(items).items():
            print(f"{category:<8}{total:>9.2f}")
        print(f"{'All':<8}{sum(i['amount'] for i in items):>9.2f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
