import unittest
from l15_tracker import add_expense, totals_by_category


class TrackerTests(unittest.TestCase):
    def test_add_expense_sets_id_and_title_case(self):
        items = []
        item = add_expense(items, 250, "food", "Lunch")
        self.assertEqual(item["id"], 1)
        self.assertEqual(item["category"], "Food")

    def test_zero_amount_is_rejected(self):
        with self.assertRaises(ValueError):
            add_expense([], 0, "Food")

    def test_totals_are_grouped_and_sorted(self):
        items = []
        add_expense(items, 100, "Travel")
        add_expense(items, 300, "Food")
        add_expense(items, 50, "Travel")
        self.assertEqual(totals_by_category(items), {"Food": 300, "Travel": 150})


if __name__ == "__main__":
    unittest.main()
