import Foundation
import Observation

@Observable
final class HabitStore {
    private let defaults: UserDefaults
    private let storageKey = "habits.v1"

    var habits: [Habit] {
        didSet { save() }
    }

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        if let data = defaults.data(forKey: "habits.v1"),
           let saved = try? JSONDecoder().decode([Habit].self, from: data) {
            habits = saved
        } else {
            habits = []
        }
    }

    func add(name: String) {
        let clean = name.trimmingCharacters(in: .whitespaces)
        guard !clean.isEmpty else { return }
        habits.append(Habit(name: clean))
    }

    func toggleToday(_ habit: Habit, today: Date = .now) {
        guard let index = habits.firstIndex(where: { $0.id == habit.id }) else { return }
        let key = DayKey.key(for: today)
        if habits[index].days.contains(key) {
            habits[index].days.remove(key)
        } else {
            habits[index].days.insert(key)
        }
    }

    func delete(at offsets: IndexSet) {
        habits.remove(atOffsets: offsets)
    }

    private func save() {
        if let data = try? JSONEncoder().encode(habits) {
            defaults.set(data, forKey: storageKey)
        }
    }
}
