import Foundation

struct ChatMessage: Identifiable, Codable, Equatable {
    enum Role: String, Codable {
        case user
        case assistant
    }

    var id = UUID()
    let role: Role
    var text: String
}

enum History {
    // The model has no memory, so each request carries the conversation again.
    // Sending only the latest messages keeps requests small and cheap.
    static func recent(_ messages: [ChatMessage], limit: Int = 12) -> [ChatMessage] {
        Array(messages.suffix(limit))
    }
}
