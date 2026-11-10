import Foundation

struct Habit: Identifiable, Codable, Equatable {
    var id = UUID()
    var name: String
    var days: Set<String> = []   // one "2026-11-10" text per day that was done
}

enum DayKey {
    static func key(for date: Date, calendar: Calendar = .current) -> String {
        let parts = calendar.dateComponents([.year, .month, .day], from: date)
        return String(format: "%04ld-%02ld-%02ld", parts.year ?? 0, parts.month ?? 0, parts.day ?? 0)
    }
}

extension Habit {
    func isDone(on date: Date, calendar: Calendar = .current) -> Bool {
        days.contains(DayKey.key(for: date, calendar: calendar))
    }

    // Days in a row, counting back from today. If today is not done yet, the streak is
    // still alive when yesterday is done, so the user does not lose it before the day ends.
    func currentStreak(today: Date = .now, calendar: Calendar = .current) -> Int {
        var day = today
        if !isDone(on: day, calendar: calendar) {
            guard let yesterday = calendar.date(byAdding: .day, value: -1, to: day) else { return 0 }
            day = yesterday
        }
        var count = 0
        while isDone(on: day, calendar: calendar) {
            count += 1
            guard let previous = calendar.date(byAdding: .day, value: -1, to: day) else { break }
            day = previous
        }
        return count
    }
}
