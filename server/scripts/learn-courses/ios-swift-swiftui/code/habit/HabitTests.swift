import Testing
import Foundation
@testable import Habits

struct HabitTests {
    // A fixed calendar and time zone so the tests give the same result everywhere.
    private var calendar: Calendar {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(identifier: "UTC")!
        return calendar
    }

    private func date(_ year: Int, _ month: Int, _ day: Int) -> Date {
        calendar.date(from: DateComponents(year: year, month: month, day: day, hour: 12))!
    }

    private func habit(done days: [Date]) -> Habit {
        Habit(name: "Read", days: Set(days.map { DayKey.key(for: $0, calendar: calendar) }))
    }

    @Test func threeDaysInARowGiveStreakThree() {
        let item = habit(done: [date(2026, 11, 8), date(2026, 11, 9), date(2026, 11, 10)])
        #expect(item.currentStreak(today: date(2026, 11, 10), calendar: calendar) == 3)
    }

    @Test func streakSurvivesUntilTodayIsDone() {
        let item = habit(done: [date(2026, 11, 8), date(2026, 11, 9)])
        #expect(item.currentStreak(today: date(2026, 11, 10), calendar: calendar) == 2)
    }

    @Test func aGapBreaksTheStreak() {
        let item = habit(done: [date(2026, 11, 6), date(2026, 11, 10)])
        #expect(item.currentStreak(today: date(2026, 11, 10), calendar: calendar) == 1)
    }

    @Test func noDaysMeansNoStreak() {
        let item = habit(done: [])
        #expect(item.currentStreak(today: date(2026, 11, 10), calendar: calendar) == 0)
    }

    @Test func keyIsPaddedAndReadable() {
        #expect(DayKey.key(for: date(2026, 3, 5), calendar: calendar) == "2026-03-05")
    }
}
