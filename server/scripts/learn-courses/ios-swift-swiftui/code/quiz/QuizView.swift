import SwiftUI

struct QuizView: View {
    @State private var engine = QuizEngine()

    var body: some View {
        NavigationStack {
            Group {
                if let question = engine.current {
                    questionView(question)
                } else {
                    finishedView
                }
            }
            .padding()
            .navigationTitle("Swift Quiz")
        }
    }

    private func questionView(_ question: Question) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            ProgressView(value: Double(engine.index), total: Double(engine.questions.count))
            Text("Question \(engine.index + 1) of \(engine.questions.count)")
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(question.text)
                .font(.title3.bold())

            ForEach(question.options.indices, id: \.self) { option in
                Button {
                    engine.choose(option)
                } label: {
                    HStack {
                        Text(question.options[option])
                        Spacer()
                        if engine.hasAnswered {
                            if option == question.answerIndex {
                                Image(systemName: "checkmark.circle.fill")
                            } else if option == engine.selected {
                                Image(systemName: "xmark.circle.fill")
                            }
                        }
                    }
                    .frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
                .tint(tint(for: option, in: question))
                .disabled(engine.hasAnswered)
            }

            if engine.hasAnswered {
                Text(question.explanation)
                    .font(.callout)
                    .padding(.top, 4)
                Button(engine.index + 1 == engine.questions.count ? "See result" : "Next") {
                    engine.next()
                }
                .buttonStyle(.borderedProminent)
            }
            Spacer()
        }
    }

    private var finishedView: some View {
        VStack(spacing: 16) {
            Spacer()
            Text("You scored \(engine.score) out of \(engine.questions.count)")
                .font(.title2.bold())
            Button("Play again") { engine.restart() }
                .buttonStyle(.borderedProminent)
            Spacer()
        }
    }

    private func tint(for option: Int, in question: Question) -> Color {
        guard engine.hasAnswered else { return .blue }
        if option == question.answerIndex { return .green }
        if option == engine.selected { return .red }
        return .gray
    }
}
