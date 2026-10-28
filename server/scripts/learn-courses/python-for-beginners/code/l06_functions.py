def add_tax(amount, rate=0.18):
    """Return the amount with tax added."""
    return round(amount * (1 + rate), 2)

def min_max(numbers):
    return min(numbers), max(numbers)

def describe(name, *, city="unknown", age=None):
    parts = [name, f"from {city}"]
    if age is not None:
        parts.append(f"age {age}")
    return ", ".join(parts)

print(add_tax(100))
print(add_tax(100, rate=0.05))
low, high = min_max([4, 9, 2, 7])
print(low, high)
print(describe("Asha", city="Pune", age=29))
print(describe("Ravi"))

# A function without return gives None
def say_hi():
    print("hi")
print(say_hi())

# Variables inside a function stay inside
def counter():
    count = 0
    count += 1
    return count
print(counter(), counter())

# A common trap: a list as a default value
def bad_add(item, items=[]):
    items.append(item)
    return items
print(bad_add("a"))
print(bad_add("b"))

def good_add(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
print(good_add("a"))
print(good_add("b"))
