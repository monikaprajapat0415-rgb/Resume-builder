import Foundation
import Observation

@Observable
@MainActor
final class JobViewModel {
    enum State {
        case loading
        case ready([Job])
        case failed
    }

    private(set) var state: State = .loading
    var filter = JobFilter()
    private let service: JobService

    init(service: JobService) {
        self.service = service
    }

    // Calculated from the full list and the filter, so the two cannot disagree.
    var shown: [Job] {
        if case .ready(let all) = state { return all.filtered(by: filter) }
        return []
    }

    func load() async {
        state = .loading
        do {
            state = .ready(try await service.jobs())
        } catch {
            state = .failed
        }
    }

    // Returns a message to show, or nil on success.
    func apply(to job: Job, note: String, fileURL: URL) async -> String? {
        let accessing = fileURL.startAccessingSecurityScopedResource()
        defer { if accessing { fileURL.stopAccessingSecurityScopedResource() } }

        let values = try? fileURL.resourceValues(forKeys: [.fileSizeKey])
        let size = values?.fileSize ?? 0
        if let problem = ResumeRules.problem(fileName: fileURL.lastPathComponent, sizeBytes: size) {
            return problem
        }
        do {
            let data = try Data(contentsOf: fileURL)
            try await service.apply(to: job, note: note, fileName: fileURL.lastPathComponent, fileData: data)
            return nil
        } catch {
            return "Could not send your application. Please try again."
        }
    }
}
