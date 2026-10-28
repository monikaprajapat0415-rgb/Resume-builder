price = 120          # a whole number (int)
quantity = 3
discount = 0.1       # a decimal number (float)

subtotal = price * quantity
total = subtotal * (1 - discount)

print("Subtotal:", subtotal)
print(f"Total after discount: {total:.2f}")
print(f"Big number with commas: {1234567:,}")

name = "  asha verma "
print(name.strip().title())
print(len(name.strip()))
print(type(price), type(discount), type(name))

# Text and numbers do not mix by themselves
age_text = "25"
age = int(age_text)
print(age + 1)
print(age_text + "1")
