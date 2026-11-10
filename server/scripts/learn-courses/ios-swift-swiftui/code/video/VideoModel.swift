import AVKit
import Combine
import Observation

@Observable
@MainActor
final class VideoModel {
    enum Status: Equatable {
        case loading
        case ready
        case failed
    }

    private(set) var status: Status = .loading
    let player = AVPlayer()
    private var cancellable: AnyCancellable?

    func play(_ video: Video) {
        status = .loading
        let item = AVPlayerItem(url: video.url)

        // Watch the item so the screen can show a spinner or an error.
        cancellable = item.publisher(for: \.status)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] newStatus in
                switch newStatus {
                case .readyToPlay: self?.status = .ready
                case .failed: self?.status = .failed
                default: break
                }
            }

        player.replaceCurrentItem(with: item)
        player.play()
    }

    func stop() {
        player.pause()
        player.replaceCurrentItem(with: nil)
        cancellable = nil
    }
}
