def grade(marks):
    if marks >= 90:
        return "A"
    elif marks >= 75:
        return "B"
    elif marks >= 50:
        return "C"
    else:
        return "Fail"

for m in [95, 80, 50, 49]:
    print(m, grade(m))

age = 17
has_id = True
if age >= 18 and has_id:
    print("Can enter")
else:
    print("Cannot enter")

# Empty things count as False
name = ""
if not name:
    print("Please enter a name")

# Comparison pitfalls
print(5 == 5.0)
print("5" == 5)
print(1 < 5 < 10)
