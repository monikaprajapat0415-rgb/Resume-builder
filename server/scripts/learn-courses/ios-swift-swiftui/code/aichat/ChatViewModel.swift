import Foundation
import Observation

@Observable
@MainActor
final class ChatViewModel {
    private(set) var messages: [ChatMessage]
    private(set) var streaming: String?
    private(set) var errorText: String?
    private let service: AIService
    private let defaults: UserDefaults
    private var job: Task<Void, Never>?

    init(service: AIService, defaults: UserDefaults = .standard) {
        self.service = service
        self.defaults = defaults
        if let data = defaults.data(forKey: "chat.v1"),
           let saved = try? JSONDecoder().decode([ChatMessage].self, from: data) {
            messages = saved
        } else {
            messages = []
        }
    }

    var isReplying: Bool { job != nil }

    func send(_ text: String) {
        let clean = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !clean.isEmpty, !isReplying else { return }
        errorText = nil
        messages.append(ChatMessage(role: .user, text: clean))
        save()
        streaming = ""

        let history = History.recent(messages)
        job = Task {
            var latest = ""
            do {
                for try await partial in service.reply(to: history) {
                    latest = partial
                    streaming = partial
                }
            } catch is CancellationError {
                // The user pressed Stop. Keep what we have.
            } catch {
                errorText = "Something went wrong. Please try again."
            }
            finish(with: latest)
        }
    }

    func stop() {
        job?.cancel()
    }

    func clear() {
        stop()
        messages = []
        save()
    }

    private func finish(with text: String) {
        if !text.isEmpty {
            messages.append(ChatMessage(role: .assistant, text: text))
            save()
        }
        streaming = nil
        job = nil
    }

    private func save() {
        if let data = try? JSONEncoder().encode(messages) {
            defaults.set(data, forKey: "chat.v1")
        }
    }
}
