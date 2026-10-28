product = {"name": "Notebook", "price": 120, "stock": 15}
print(product["name"], product.get("colour", "no colour"))
product["stock"] -= 3
product["category"] = "Stationery"
print(product)

for key, value in product.items():
    print(f"{key}: {value}")

# Counting words
text = "the cat and the dog and the bird"
counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1
print(counts)

# A list of dictionaries, like rows of a table
orders = [
    {"id": 1, "city": "Pune", "amount": 450},
    {"id": 2, "city": "Delhi", "amount": 300},
    {"id": 3, "city": "Pune", "amount": 150},
]
pune_total = sum(o["amount"] for o in orders if o["city"] == "Pune")
print("Pune total:", pune_total)

# Tuples and sets
point = (3, 4)
x, y = point
print(x, y)
cities = {"Pune", "Delhi", "Pune"}
print(len(cities), "Delhi" in cities)
unique = sorted(set([3, 1, 3, 2, 1]))
print(unique)
