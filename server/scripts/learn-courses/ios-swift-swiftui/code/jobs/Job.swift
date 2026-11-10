import Foundation

enum JobType: String, Codable, CaseIterable, Identifiable {
    case fullTime = "Full-time"
    case internship = "Internship"
    case contract = "Contract"

    var id: String { rawValue }
}

struct Job: Identifiable, Codable, Hashable {
    let id: Int
    let title: String
    let company: String
    let location: String
    let remote: Bool
    let type: JobType
    let description: String
}

struct JobFilter: Equatable {
    var text = ""
    var remoteOnly = false
    var types: Set<JobType> = []
}

extension Array where Element == Job {
    // A pure function: easy to test and the screen can never disagree with the filter.
    func filtered(by filter: JobFilter) -> [Job] {
        let needle = filter.text.trimmingCharacters(in: .whitespaces).lowercased()
        return self.filter { job in
            if filter.remoteOnly && !job.remote { return false }
            if !filter.types.isEmpty && !filter.types.contains(job.type) { return false }
            if needle.isEmpty { return true }
            return job.title.lowercased().contains(needle)
                || job.company.lowercased().contains(needle)
                || job.location.lowercased().contains(needle)
        }
    }
}

enum SampleJobs {
    static let all: [Job] = [
        Job(id: 1, title: "iOS Developer", company: "Bright Apps", location: "Pune", remote: false,
            type: .fullTime, description: "Build SwiftUI features for a consumer app."),
        Job(id: 2, title: "Swift Intern", company: "Nimbus Labs", location: "Remote", remote: true,
            type: .internship, description: "Learn on the job with a small mobile team."),
        Job(id: 3, title: "Kotlin Android Developer", company: "Bright Apps", location: "Pune", remote: true,
            type: .contract, description: "Six month contract for a Kotlin and Compose app.")
    ]
}
