from collections import Counter, defaultdict
from datetime import date, timedelta
import random
import statistics

start = date(2026, 1, 31)
print(start.strftime("%d %B %Y"), start.weekday())   # 0 is Monday
print(start + timedelta(days=30))
print((date(2026, 3, 1) - start).days, "days between")
print(date.fromisoformat("2026-02-14").isoformat())

votes = ["tea", "coffee", "tea", "juice", "tea", "coffee"]
print(Counter(votes).most_common(2))

groups = defaultdict(list)
for name, city in [("Asha", "Pune"), ("Ravi", "Delhi"), ("Meena", "Pune")]:
    groups[city].append(name)
print(dict(groups))

marks = [72, 85, 90, 66, 85]
print(statistics.mean(marks), statistics.median(marks), statistics.mode(marks))

random.seed(7)
picked = random.choice(["a", "b", "c"])
print(picked in ["a", "b", "c"], len(random.sample(range(100), 5)))

names = ["Asha", "Ravi", "Meena"]
scores = [90, 72, 85]
for n, s in zip(names, scores):
    print(n, s)
ranked = sorted(zip(names, scores), key=lambda pair: pair[1], reverse=True)
print(ranked)
print(any(s < 75 for s in scores), all(s > 50 for s in scores))
