prices = [120, 80, 650, 45]

print(len(prices), prices[0], prices[-1])
prices.append(300)
print(sum(prices), max(prices), min(prices))

for price in prices:
    if price > 500:
        print("Expensive:", price)

for i, price in enumerate(prices, start=1):
    print(i, price)

for n in range(3):
    print("Round", n)

total = 0
count = 0
while total < 500:
    total += prices[count]
    count += 1
print("Reached", total, "after", count, "items")

cheap = [p for p in prices if p < 100]
doubled = [p * 2 for p in prices]
print(cheap)
print(doubled)

print(sorted(prices))
print(prices[1:3])
