import math
import statistics
from shop_utils import with_tax, money

print(math.sqrt(144), math.ceil(2.1), round(math.pi, 4))
print(statistics.mean([10, 20, 60]), statistics.median([10, 20, 60]))
print(money(with_tax(1000)))
print(__name__)
