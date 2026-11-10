import Foundation

struct Question: Identifiable, Equatable {
    let id = UUID()
    let text: String
    let options: [String]
    let answerIndex: Int
    let explanation: String
}

enum SampleQuestions {
    static let all: [Question] = [
        Question(text: "Which keyword makes a constant in Swift?",
                 options: ["let", "var", "const"],
                 answerIndex: 0,
                 explanation: "let makes a value that cannot be reassigned. var makes one that can."),
        Question(text: "What does an optional such as String? hold?",
                 options: ["A String or nil", "Always a String", "Only numbers"],
                 answerIndex: 0,
                 explanation: "An optional is either a value or nil, and Swift makes you handle both."),
        Question(text: "Which property wrapper stores state owned by a SwiftUI view?",
                 options: ["@State", "@Published", "@Model"],
                 answerIndex: 0,
                 explanation: "@State keeps a value that the view owns and redraws when it changes."),
        Question(text: "What is the difference between a struct and a class?",
                 options: ["Structs are copied, classes are shared", "Structs cannot have functions", "There is none"],
                 answerIndex: 0,
                 explanation: "Structs are value types and are copied. Classes are reference types and are shared."),
        Question(text: "Which call starts an async function?",
                 options: ["await", "async let only", "defer"],
                 answerIndex: 0,
                 explanation: "You call an async function with await, inside an async context such as a Task.")
    ]
}
