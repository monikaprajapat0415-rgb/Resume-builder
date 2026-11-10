import SwiftUI
import Charts

struct FitnessView: View {
    @State private var model: FitnessViewModel

    init(service: HealthService) {
        _model = State(initialValue: FitnessViewModel(service: service))
    }

    var body: some View {
        NavigationStack {
            Group {
                switch model.state {
                case .loading:
                    ProgressView()
                case .failed(let message):
                    VStack(spacing: 12) {
                        Text(message)
                        Button("Try again") { Task { await model.load() } }
                            .buttonStyle(.borderedProminent)
                    }
                case .ready(let days):
                    ScrollView {
                        VStack(alignment: .leading, spacing: 16) {
                            summary(days)
                            chart(days)
                            Text("Met the goal on \(StepMath.daysMetGoal(days, goal: model.goal)) of \(days.count) days. Average: \(StepMath.average(days)) steps.")
                                .font(.callout)
                                .foregroundStyle(.secondary)
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("Steps")
        }
        .task { await model.load() }
    }

    private func summary(_ days: [DaySteps]) -> some View {
        let steps = days.last?.steps ?? 0
        return VStack(alignment: .leading, spacing: 6) {
            Text("Today").font(.caption).foregroundStyle(.secondary)
            Text("\(steps)").font(.system(size: 52, weight: .bold))
            ProgressView(value: StepMath.progress(steps: steps, goal: model.goal))
            Text("Goal: \(model.goal) steps").font(.caption)
        }
    }

    private func chart(_ days: [DaySteps]) -> some View {
        Chart {
            ForEach(days) { day in
                BarMark(
                    x: .value("Day", day.date, unit: .day),
                    y: .value("Steps", day.steps)
                )
                .foregroundStyle(day.steps >= model.goal ? Color.green : Color.blue)
            }
            RuleMark(y: .value("Goal", model.goal))
                .lineStyle(StrokeStyle(lineWidth: 1, dash: [4]))
                .foregroundStyle(.orange)
        }
        .frame(height: 220)
        .accessibilityLabel("Bar chart of steps for the last seven days")
    }
}
