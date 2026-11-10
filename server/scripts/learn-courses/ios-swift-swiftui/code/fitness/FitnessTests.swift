import Testing
import Foundation
@testable import StepTracker

struct FitnessTests {
    private func days(_ steps: [Int]) -> [DaySteps] {
        steps.enumerated().map { DaySteps(date: Date(timeIntervalSince1970: Double($0.offset) * 86_400), steps: $0.element) }
    }

    @Test func progressIsClamped() {
        #expect(StepMath.progress(steps: 4000, goal: 8000) == 0.5)
        #expect(StepMath.progress(steps: 20000, goal: 8000) == 1)
        #expect(StepMath.progress(steps: 100, goal: 0) == 0)
    }

    @Test func averageAndGoalDays() {
        let week = days([4000, 8000, 12000])
        #expect(StepMath.average(week) == 8000)
        #expect(StepMath.daysMetGoal(week, goal: 8000) == 2)
    }

    @Test func emptyListIsSafe() {
        #expect(StepMath.average([]) == 0)
    }

    @MainActor
    @Test func fakeServiceFillsTheChart() async {
        let model = FitnessViewModel(service: FakeHealthService())
        await model.load()
        #expect(model.today != nil)
    }
}
