from dataclasses import dataclass

class Wallet:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        self.history = []

    def add(self, amount, note=""):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.balance += amount
        self.history.append(("add", amount, note))

    def spend(self, amount, note=""):
        if amount > self.balance:
            raise ValueError("Not enough money")
        self.balance -= amount
        self.history.append(("spend", amount, note))

    def __str__(self):
        return f"{self.owner}: balance {self.balance}"

w = Wallet("Asha", 500)
w.add(200, "salary bonus")
w.spend(150, "groceries")
print(w)
print(len(w.history), w.history[-1])

try:
    w.spend(10_000)
except ValueError as error:
    print("Blocked:", error)

@dataclass
class Expense:
    category: str
    amount: float
    paid: bool = False

e = Expense("Food", 250.0)
print(e)
print(e.amount, e == Expense("Food", 250.0))

class Savings(Wallet):
    def add_interest(self, rate):
        self.add(round(self.balance * rate, 2), "interest")

s = Savings("Ravi", 1000)
s.add_interest(0.05)
print(s)
