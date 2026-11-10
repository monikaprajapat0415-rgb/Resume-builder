import Foundation

enum StepMath {
    // 0...1 for the progress bar. Never above 1, never below 0.
    static func progress(steps: Int, goal: Int) -> Double {
        guard goal > 0 else { return 0 }
        return min(max(Double(steps) / Double(goal), 0), 1)
    }

    static func average(_ days: [DaySteps]) -> Int {
        guard !days.isEmpty else { return 0 }
        return days.reduce(0) { $0 + $1.steps } / days.count
    }

    static func daysMetGoal(_ days: [DaySteps], goal: Int) -> Int {
        days.filter { $0.steps >= goal }.count
    }
}
