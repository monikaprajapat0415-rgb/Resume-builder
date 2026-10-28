"""Small helper functions we can import from other files."""

TAX_RATE = 0.18

def with_tax(amount):
    return round(amount * (1 + TAX_RATE), 2)

def money(amount):
    return f"Rs {amount:,.2f}"

if __name__ == "__main__":
    # Runs only when you start this file directly, not when it is imported
    print("Testing:", money(with_tax(1000)))
