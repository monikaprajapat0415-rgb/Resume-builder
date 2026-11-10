import Testing
@testable import SwiftQuiz

struct QuizTests {
    private let two = [
        Question(text: "One?", options: ["a", "b"], answerIndex: 0, explanation: ""),
        Question(text: "Two?", options: ["a", "b"], answerIndex: 1, explanation: "")
    ]

    @Test func correctAnswerScores() {
        let engine = QuizEngine(questions: two)
        engine.choose(0)
        #expect(engine.score == 1)
    }

    @Test func secondTapIsIgnored() {
        let engine = QuizEngine(questions: two)
        engine.choose(1)      // wrong
        engine.choose(0)      // would be right, but too late
        #expect(engine.score == 0)
    }

    @Test func mustAnswerBeforeNext() {
        let engine = QuizEngine(questions: two)
        engine.next()
        #expect(engine.index == 0)
    }

    @Test func finishesAfterLastQuestion() {
        let engine = QuizEngine(questions: two)
        engine.choose(0)
        engine.next()
        engine.choose(1)
        engine.next()
        #expect(engine.isFinished)
        #expect(engine.score == 2)
    }
}
