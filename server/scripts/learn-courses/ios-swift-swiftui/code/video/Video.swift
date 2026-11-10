import Foundation

struct Video: Identifiable, Equatable {
    let id = UUID()
    let title: String
    let url: URL
    let note: String
}

// The first address is Apple's public HLS sample stream. Addresses like these can change,
// so replace them with streams you have the right to play (your own server or a video host).
enum SampleVideos {
    static let all: [Video] = [
        Video(title: "Apple HLS sample (adaptive)",
              url: URL(string: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8")!,
              note: "Adaptive stream with several qualities"),
        Video(title: "Your own video",
              url: URL(string: "https://example.com/video/lesson-1.m3u8")!,
              note: "Placeholder. Replace this address")
    ]
}

enum VideoFormat {
    // 3725 -> "1:02:05", 125 -> "2:05"
    static func duration(_ seconds: Double) -> String {
        guard seconds.isFinite, seconds >= 0 else { return "0:00" }
        let total = Int(seconds)
        let hours = total / 3600
        let minutes = (total % 3600) / 60
        let secs = total % 60
        if hours > 0 {
            return "\(hours):\(String(format: "%02d", minutes)):\(String(format: "%02d", secs))"
        }
        return "\(minutes):\(String(format: "%02d", secs))"
    }
}
