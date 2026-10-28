def parse_amount(text):
    """Turn text like '1,250.50' into a number, or raise a clear error."""
    cleaned = text.strip().replace(",", "")
    try:
        value = float(cleaned)
    except ValueError:
        raise ValueError(f"'{text}' is not a number") from None
    if value < 0:
        raise ValueError("Amount cannot be negative")
    return value

for sample in ["1,250.50", "abc", "-5", " 40 "]:
    try:
        print(parse_amount(sample))
    except ValueError as error:
        print("Error:", error)

try:
    print(10 / 0)
except ZeroDivisionError:
    print("Cannot divide by zero")

try:
    with open("no_such_file.txt", encoding="utf-8") as f:
        f.read()
except FileNotFoundError as error:
    print("File problem:", error.filename)
finally:
    print("This always runs")

numbers = [1, 2]
try:
    print(numbers[5])
except IndexError as error:
    print(type(error).__name__, "-", error)

class BudgetError(Exception):
    pass

try:
    raise BudgetError("Over budget by 300")
except BudgetError as error:
    print("Caught:", error)
