import SwiftUI
import VisionKit
import AVFoundation

struct QRScreen: View {
    @Environment(\.openURL) private var openURL
    @State private var result: QRResult?
    @State private var cameraAllowed = AVCaptureDevice.authorizationStatus(for: .video) == .authorized

    var body: some View {
        NavigationStack {
            Group {
                if !DataScannerViewController.isSupported {
                    message("This device cannot scan codes. Try a real iPhone.")
                } else if let result {
                    card(for: result)
                } else if cameraAllowed {
                    VStack {
                        ScannerView { text in
                            result = QRClassifier.classify(text)
                        }
                        Text("Point the camera at a QR code")
                            .padding()
                    }
                } else {
                    VStack(spacing: 12) {
                        Text("Camera access is needed to scan codes. The picture never leaves your phone.")
                            .multilineTextAlignment(.center)
                        Button("Allow camera") {
                            AVCaptureDevice.requestAccess(for: .video) { granted in
                                DispatchQueue.main.async { cameraAllowed = granted }
                            }
                        }
                        .buttonStyle(.borderedProminent)
                    }
                    .padding()
                }
            }
            .navigationTitle("QR Scanner")
        }
    }

    private func message(_ text: String) -> some View {
        Text(text).multilineTextAlignment(.center).padding()
    }

    private func card(for result: QRResult) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(result.title).font(.title2.bold())
            switch result {
            case .link(let url):
                Text(url.absoluteString).textSelection(.enabled)
                Text("Open only links you trust.").font(.footnote).foregroundStyle(.secondary)
                Button("Open") { openURL(url) }
                    .buttonStyle(.borderedProminent)
            case .wifi(let name, let security):
                Text("Name: \(name)")
                Text("Security: \(security)")
            case .text(let text):
                Text(text).textSelection(.enabled)
            }
            Button("Scan again") { self.result = nil }
                .buttonStyle(.bordered)
            Spacer()
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
