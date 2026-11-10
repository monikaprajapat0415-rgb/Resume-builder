import Testing
@testable import StreamPlayer

struct VideoTests {
    @Test func shortDurations() {
        #expect(VideoFormat.duration(0) == "0:00")
        #expect(VideoFormat.duration(125) == "2:05")
    }

    @Test func hoursAreShown() {
        #expect(VideoFormat.duration(3725) == "1:02:05")
    }

    @Test func badValues() {
        #expect(VideoFormat.duration(-1) == "0:00")
        #expect(VideoFormat.duration(.nan) == "0:00")
    }

    @Test func listHasAnHLSStream() {
        #expect(SampleVideos.all.contains { $0.url.pathExtension == "m3u8" })
    }
}
