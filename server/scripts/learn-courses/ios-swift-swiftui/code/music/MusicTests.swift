import Testing
@testable import MusicPlayer

struct MusicTests {
    @Test func clockFormat() {
        #expect(TimeFormat.clock(0) == "0:00")
        #expect(TimeFormat.clock(125) == "2:05")
        #expect(TimeFormat.clock(3599) == "59:59")
    }

    @Test func badValuesAreSafe() {
        #expect(TimeFormat.clock(-5) == "0:00")
        #expect(TimeFormat.clock(.nan) == "0:00")
        #expect(TimeFormat.clock(.infinity) == "0:00")
    }

    @Test func sampleListIsNotEmpty() {
        #expect(!SampleTracks.all.isEmpty)
    }
}
