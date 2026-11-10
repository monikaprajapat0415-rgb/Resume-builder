import Testing
import Foundation
@testable import JobPortal

struct JobsTests {
    private let jobs = SampleJobs.all

    @Test func textSearchMatchesTitleCompanyOrPlace() {
        #expect(jobs.filtered(by: JobFilter(text: "kotlin")).map(\.id) == [3])
        #expect(jobs.filtered(by: JobFilter(text: "bright")).count == 2)
        #expect(jobs.filtered(by: JobFilter(text: "pune")).count == 2)
    }

    @Test func filtersCombine() {
        let filter = JobFilter(text: "", remoteOnly: true, types: [.contract])
        #expect(jobs.filtered(by: filter).map(\.id) == [3])
    }

    @Test func emptyFilterShowsEverything() {
        #expect(jobs.filtered(by: JobFilter()).count == jobs.count)
    }

    @Test func resumeRules() {
        #expect(ResumeRules.problem(fileName: "cv.png", sizeBytes: 1000) == "Choose a PDF or Word file.")
        #expect(ResumeRules.problem(fileName: "cv.pdf", sizeBytes: 0) == "That file is empty.")
        #expect(ResumeRules.problem(fileName: "cv.pdf", sizeBytes: 6 * 1024 * 1024) == "The file is over 5 MB.")
        #expect(ResumeRules.problem(fileName: "CV.PDF", sizeBytes: 200_000) == nil)
    }

    @Test func multipartContainsBothParts() {
        let body = Multipart.body(boundary: "XYZ", note: "Hello", fileName: "cv.pdf",
                                  mime: "application/pdf", fileData: Data("DATA".utf8))
        let text = String(decoding: body, as: UTF8.self)
        #expect(text.contains("name=\"note\""))
        #expect(text.contains("filename=\"cv.pdf\""))
        #expect(text.hasSuffix("--XYZ--\r\n"))
    }
}
