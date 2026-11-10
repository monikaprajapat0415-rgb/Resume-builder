import Testing
import Foundation
@testable import AIChat

@MainActor
struct AIChatTests {
    private func defaults() -> UserDefaults {
        UserDefaults(suiteName: UUID().uuidString)!
    }

    @Test func historyKeepsOnlyTheLatestMessages() {
        let many = (1...30).map { ChatMessage(role: .user, text: "m\($0)") }
        let recent = History.recent(many, limit: 5)
        #expect(recent.count == 5)
        #expect(recent.first?.text == "m26")
    }

    @Test func fakeServiceStreamsAGrowingText() async throws {
        var parts: [String] = []
        for try await partial in FakeAIService().reply(to: [ChatMessage(role: .user, text: "Hi")]) {
            parts.append(partial)
        }
        #expect(parts.count > 3)
        #expect(parts[1].hasPrefix(parts[0]))
    }

    @Test func replyIsSavedWhenFinished() async throws {
        let model = ChatViewModel(service: FakeAIService(), defaults: defaults())
        model.send("What is Swift?")
        while model.isReplying { try await Task.sleep(for: .milliseconds(50)) }
        #expect(model.messages.count == 2)
        #expect(model.messages.last?.role == .assistant)
    }

    @Test func emptyMessageIsIgnored() {
        let model = ChatViewModel(service: FakeAIService(), defaults: defaults())
        model.send("   ")
        #expect(model.messages.isEmpty)
    }
}
