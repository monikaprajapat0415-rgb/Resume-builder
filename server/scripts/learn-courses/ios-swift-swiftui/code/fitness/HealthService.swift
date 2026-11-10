import Foundation
import HealthKit

struct DaySteps: Identifiable, Equatable {
    let date: Date
    let steps: Int
    var id: Date { date }
}

enum HealthError: LocalizedError {
    case unavailable

    var errorDescription: String? {
        "Health data is not available on this device."
    }
}

protocol HealthService {
    func requestAccess() async throws
    func lastDays(_ count: Int) async throws -> [DaySteps]
}

// The real service. It needs the HealthKit capability and the usage text from the lesson.
final class HealthKitService: HealthService {
    private let store = HKHealthStore()
    private let stepType = HKQuantityType(.stepCount)

    func requestAccess() async throws {
        guard HKHealthStore.isHealthDataAvailable() else { throw HealthError.unavailable }
        // For read access iOS never tells the app whether the user said yes or no.
        try await store.requestAuthorization(toShare: [], read: [stepType])
    }

    func lastDays(_ count: Int) async throws -> [DaySteps] {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: .now)
        guard let start = calendar.date(byAdding: .day, value: -(count - 1), to: today),
              let end = calendar.date(byAdding: .day, value: 1, to: today) else { return [] }
        let predicate = HKQuery.predicateForSamples(withStart: start, end: end)

        return try await withCheckedThrowingContinuation { continuation in
            let query = HKStatisticsCollectionQuery(
                quantityType: stepType,
                quantitySamplePredicate: predicate,
                options: .cumulativeSum,
                anchorDate: start,
                intervalComponents: DateComponents(day: 1)
            )
            query.initialResultsHandler = { _, results, error in
                if let error {
                    continuation.resume(throwing: error)
                    return
                }
                var days: [DaySteps] = []
                results?.enumerateStatistics(from: start, to: end) { statistics, _ in
                    let value = statistics.sumQuantity()?.doubleValue(for: .count()) ?? 0
                    days.append(DaySteps(date: statistics.startDate, steps: Int(value)))
                }
                continuation.resume(returning: days)
            }
            store.execute(query)
        }
    }
}

// Made-up numbers for the Simulator, which has no step data, and for tests.
struct FakeHealthService: HealthService {
    func requestAccess() async throws {}

    func lastDays(_ count: Int) async throws -> [DaySteps] {
        let calendar = Calendar.current
        let sample = [4200, 8800, 6100, 10250, 7300, 9100, 5400]
        return (0..<count).map { offset in
            let day = calendar.date(byAdding: .day, value: -(count - 1 - offset), to: calendar.startOfDay(for: .now)) ?? .now
            return DaySteps(date: day, steps: sample[offset % sample.count])
        }
    }
}
