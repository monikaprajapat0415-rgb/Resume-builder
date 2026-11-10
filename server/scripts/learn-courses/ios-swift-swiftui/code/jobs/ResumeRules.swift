import Foundation
import UniformTypeIdentifiers

enum ResumeRules {
    static let maxBytes = 5 * 1024 * 1024
    static let allowedExtensions: Set<String> = ["pdf", "doc", "docx"]

    // Returns a message for the user, or nil when the file is fine.
    // The server must check again: anyone can skip this app and call the server directly.
    static func problem(fileName: String, sizeBytes: Int) -> String? {
        let ext = (fileName as NSString).pathExtension.lowercased()
        if !allowedExtensions.contains(ext) { return "Choose a PDF or Word file." }
        if sizeBytes <= 0 { return "That file is empty." }
        if sizeBytes > maxBytes { return "The file is over 5 MB." }
        return nil
    }

    static let contentTypes: [UTType] = [
        .pdf,
        UTType(filenameExtension: "doc") ?? .data,
        UTType(filenameExtension: "docx") ?? .data
    ]

    static func mimeType(for fileName: String) -> String {
        switch (fileName as NSString).pathExtension.lowercased() {
        case "pdf": return "application/pdf"
        case "doc": return "application/msword"
        case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        default: return "application/octet-stream"
        }
    }
}

enum Multipart {
    // Builds the body of a multipart/form-data request: a text part and a file part.
    static func body(boundary: String, note: String, fileName: String, mime: String, fileData: Data) -> Data {
        var body = Data()
        func add(_ text: String) { body.append(Data(text.utf8)) }

        add("--\(boundary)\r\n")
        add("Content-Disposition: form-data; name=\"note\"\r\n\r\n")
        add("\(note)\r\n")

        add("--\(boundary)\r\n")
        add("Content-Disposition: form-data; name=\"resume\"; filename=\"\(fileName)\"\r\n")
        add("Content-Type: \(mime)\r\n\r\n")
        body.append(fileData)
        add("\r\n--\(boundary)--\r\n")
        return body
    }
}
