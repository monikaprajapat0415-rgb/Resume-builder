import Foundation

struct Track: Identifiable, Equatable {
    let id = UUID()
    let title: String
    let artist: String
    let url: URL
}

// These addresses are placeholders. Replace them with audio you have the right to play,
// such as your own files or royalty-free music, or the app will show an error.
enum SampleTracks {
    static let all: [Track] = [
        Track(title: "Morning Light", artist: "Sample Artist",
              url: URL(string: "https://example.com/audio/morning-light.mp3")!),
        Track(title: "Evening Walk", artist: "Sample Artist",
              url: URL(string: "https://example.com/audio/evening-walk.mp3")!),
        Track(title: "Rain Window", artist: "Sample Artist",
              url: URL(string: "https://example.com/audio/rain-window.mp3")!)
    ]
}

enum TimeFormat {
    // 125 -> "2:05"
    static func clock(_ seconds: Double) -> String {
        guard seconds.isFinite, seconds >= 0 else { return "0:00" }
        let total = Int(seconds)
        return "\(total / 60):\(String(format: "%02d", total % 60))"
    }
}
