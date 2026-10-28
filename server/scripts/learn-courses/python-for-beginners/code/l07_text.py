raw = "  +91 98765-43210  "
digits = "".join(ch for ch in raw if ch.isdigit())
print(digits)

line = "Asha, Pune, 29"
name, city, age = [part.strip() for part in line.split(",")]
print(name, city, int(age))

words = "python is fun".split()
print(words, " ".join(w.capitalize() for w in words))

s = "Resume_Final_v2.PDF"
print(s.lower(), s.replace("_", " "), s.endswith(".pdf"))
print(s.lower().endswith(".pdf"))
print("final" in s.lower())

title = "Python"
print(title[0], title[-1], title[1:4], title[::-1])

print(f"{'Item':<10}{'Price':>8}")
print(f"{'Pen':<10}{12.5:>8.2f}")
print(f"{'Notebook':<10}{120:>8.2f}")

email = "Asha@Example.COM "
print(email.strip().lower())
print("@" in email, email.split("@")[1].strip().lower())
