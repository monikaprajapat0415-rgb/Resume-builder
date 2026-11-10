import Foundation
import Observation

@Observable
final class QuizEngine {
    private(set) var questions: [Question]
    private(set) var index = 0
    private(set) var score = 0
    private(set) var selected: Int?

    init(questions: [Question] = SampleQuestions.all) {
        self.questions = questions
    }

    var current: Question? {
        index < questions.count ? questions[index] : nil
    }

    var isFinished: Bool { index >= questions.count }
    var hasAnswered: Bool { selected != nil }

    // The first tap counts. Later taps on the same question are ignored.
    func choose(_ option: Int) {
        guard let question = current, selected == nil else { return }
        selected = option
        if option == question.answerIndex { score += 1 }
    }

    func next() {
        guard selected != nil else { return }
        selected = nil
        index += 1
    }

    func restart() {
        questions.shuffle()
        index = 0
        score = 0
        selected = nil
    }
}
