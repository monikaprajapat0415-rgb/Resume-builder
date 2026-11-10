import Foundation

protocol JobService {
    func jobs() async throws -> [Job]
    func apply(to job: Job, note: String, fileName: String, fileData: Data) async throws
}

// Talks to YOUR backend. Contract: GET {base}/jobs returns a JSON array of jobs,
// POST {base}/jobs/{id}/apply accepts multipart form data with "note" and "resume".
struct RemoteJobService: JobService {
    let baseURL: URL

    func jobs() async throws -> [Job] {
        let (data, response) = try await URLSession.shared.data(from: baseURL.appendingPathComponent("jobs"))
        try Self.check(response)
        return try JSONDecoder().decode([Job].self, from: data)
    }

    func apply(to job: Job, note: String, fileName: String, fileData: Data) async throws {
        let boundary = "Boundary-\(UUID().uuidString)"
        var request = URLRequest(url: baseURL.appendingPathComponent("jobs/\(job.id)/apply"))
        request.httpMethod = "POST"
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        request.httpBody = Multipart.body(boundary: boundary, note: note, fileName: fileName,
                                          mime: ResumeRules.mimeType(for: fileName), fileData: fileData)
        let (_, response) = try await URLSession.shared.data(for: request)
        try Self.check(response)
    }

    private static func check(_ response: URLResponse) throws {
        if let http = response as? HTTPURLResponse, !(200..<300).contains(http.statusCode) {
            throw URLError(.badServerResponse)
        }
    }
}

// Sample data so the whole app runs with no backend.
struct FakeJobService: JobService {
    func jobs() async throws -> [Job] { SampleJobs.all }
    func apply(to job: Job, note: String, fileName: String, fileData: Data) async throws {
        try await Task.sleep(for: .milliseconds(600))
    }
}
