import Testing
import Foundation
@testable import QRScanner

struct QRTests {
    @Test func webAddressIsALink() {
        #expect(QRClassifier.classify("https://example.com/a?b=1") == .link(URL(string: "https://example.com/a?b=1")!))
    }

    @Test func otherSchemesAreOnlyText() {
        #expect(QRClassifier.classify("javascript:alert(1)") == .text("javascript:alert(1)"))
        #expect(QRClassifier.classify("tel:+911234567890") == .text("tel:+911234567890"))
    }

    @Test func wifiCodeIsRecognised() {
        #expect(QRClassifier.classify("WIFI:T:WPA;S:HomeNet;P:secret;;") == .wifi(name: "HomeNet", security: "WPA"))
    }

    @Test func plainTextStaysText() {
        #expect(QRClassifier.classify("  hello world ") == .text("hello world"))
    }
}
