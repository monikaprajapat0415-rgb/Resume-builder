import Foundation

enum QRResult: Equatable {
    case link(URL)
    case wifi(name: String, security: String)
    case text(String)

    var title: String {
        switch self {
        case .link: return "Link"
        case .wifi: return "Wi-Fi network"
        case .text: return "Text"
        }
    }
}

enum QRClassifier {
    // Scanned content is untrusted input: it can be anything. We only decide what kind it is.
    static func classify(_ raw: String) -> QRResult {
        let text = raw.trimmingCharacters(in: .whitespacesAndNewlines)

        if text.uppercased().hasPrefix("WIFI:") {
            let name = field("S", in: text) ?? "Unknown"
            let security = field("T", in: text) ?? "none"
            return .wifi(name: name, security: security)
        }

        if let url = URL(string: text),
           let scheme = url.scheme?.lowercased(),
           ["http", "https"].contains(scheme),
           url.host != nil {
            return .link(url)
        }
        return .text(text)
    }

    // Reads one field from "WIFI:T:WPA;S:MyNetwork;P:secret;;"
    private static func field(_ key: String, in text: String) -> String? {
        for part in text.dropFirst(5).split(separator: ";") {
            if part.hasPrefix(key + ":") {
                return String(part.dropFirst(key.count + 1))
            }
        }
        return nil
    }
}
