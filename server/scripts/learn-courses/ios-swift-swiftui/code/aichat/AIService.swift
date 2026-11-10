import Foundation

protocol AIService {
    // Streams the growing reply. Each value is the whole text so far.
    func reply(to history: [ChatMessage]) -> AsyncThrowingStream<String, Error>
}

// Makes up an answer word by word, so you can build and test the whole app
// with no key, no server and no cost.
struct FakeAIService: AIService {
    func reply(to history: [ChatMessage]) -> AsyncThrowingStream<String, Error> {
        AsyncThrowingStream { continuation in
            let task = Task {
                let question = history.last?.text ?? ""
                let words = "You asked: \(question). This is a made-up answer. Connect the app to your own server to get real AI replies.".split(separator: " ")
                var text = ""
                for word in words {
                    if Task.isCancelled { break }
                    try? await Task.sleep(for: .milliseconds(120))
                    text += (text.isEmpty ? "" : " ") + word
                    continuation.yield(text)
                }
                continuation.finish()
            }
            continuation.onTermination = { _ in task.cancel() }
        }
    }
}

// Talks to YOUR server. The secret AI key lives on that server, never in this app.
// Contract: POST {"messages":[{"role":"user","text":"..."}]} and the server streams back plain text.
struct ServerAIService: AIService {
    let endpoint: URL

    func reply(to history: [ChatMessage]) -> AsyncThrowingStream<String, Error> {
        AsyncThrowingStream { continuation in
            let task = Task {
                do {
                    var request = URLRequest(url: endpoint)
                    request.httpMethod = "POST"
                    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
                    request.httpBody = try JSONEncoder().encode(["messages": History.recent(history)])

                    let (bytes, response) = try await URLSession.shared.bytes(for: request)
                    if let http = response as? HTTPURLResponse, !(200..<300).contains(http.statusCode) {
                        throw URLError(.badServerResponse)
                    }
                    var text = ""
                    for try await character in bytes.characters {
                        text.append(character)
                        continuation.yield(text)
                    }
                    continuation.finish()
                } catch {
                    continuation.finish(throwing: error)
                }
            }
            continuation.onTermination = { _ in task.cancel() }
        }
    }
}
