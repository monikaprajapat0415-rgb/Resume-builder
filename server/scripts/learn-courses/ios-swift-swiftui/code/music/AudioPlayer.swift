import AVFoundation
import MediaPlayer
import Observation

@Observable
@MainActor
final class AudioPlayer {
    private(set) var tracks: [Track]
    private(set) var index = 0
    private(set) var isPlaying = false
    private(set) var position: Double = 0
    private(set) var duration: Double = 0
    private(set) var errorMessage: String?

    private let player = AVPlayer()
    private var timeObserver: Any?
    private var endObserver: NSObjectProtocol?

    init(tracks: [Track] = SampleTracks.all) {
        self.tracks = tracks
        configureSession()
        configureRemoteCommands()
        observeTime()
        load(index: 0)
    }

    var current: Track? {
        tracks.indices.contains(index) ? tracks[index] : nil
    }

    func toggle() {
        if isPlaying {
            player.pause()
        } else {
            player.play()
        }
        isPlaying.toggle()
        updateNowPlaying()
    }

    func next() { load(index: (index + 1) % max(tracks.count, 1), autoplay: isPlaying) }
    func previous() { load(index: (index - 1 + tracks.count) % max(tracks.count, 1), autoplay: isPlaying) }

    func seek(to seconds: Double) {
        player.seek(to: CMTime(seconds: seconds, preferredTimescale: 600))
        position = seconds
    }

    private func load(index newIndex: Int, autoplay: Bool = false) {
        guard tracks.indices.contains(newIndex) else { return }
        index = newIndex
        errorMessage = nil
        position = 0
        duration = 0

        let item = AVPlayerItem(url: tracks[newIndex].url)
        player.replaceCurrentItem(with: item)

        if let endObserver { NotificationCenter.default.removeObserver(endObserver) }
        endObserver = NotificationCenter.default.addObserver(
            forName: .AVPlayerItemDidPlayToEndTime, object: item, queue: .main
        ) { [weak self] _ in
            Task { @MainActor in self?.next() }
        }

        Task {
            do {
                let seconds = try await item.asset.load(.duration).seconds
                duration = seconds.isFinite ? seconds : 0
                updateNowPlaying()
            } catch {
                errorMessage = "This track cannot be played right now."
                isPlaying = false
            }
        }
        if autoplay { player.play() }
    }

    private func observeTime() {
        let interval = CMTime(seconds: 0.5, preferredTimescale: 600)
        timeObserver = player.addPeriodicTimeObserver(forInterval: interval, queue: .main) { [weak self] time in
            Task { @MainActor in
                guard let self, time.seconds.isFinite else { return }
                self.position = time.seconds
            }
        }
    }

    // Needed so audio keeps playing with the screen off. Also turn on the
    // "Audio, AirPlay, and Picture in Picture" background mode in Signing & Capabilities.
    private func configureSession() {
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
        try? AVAudioSession.sharedInstance().setActive(true)
    }

    private func configureRemoteCommands() {
        let center = MPRemoteCommandCenter.shared()
        center.playCommand.addTarget { [weak self] _ in
            Task { @MainActor in if self?.isPlaying == false { self?.toggle() } }
            return .success
        }
        center.pauseCommand.addTarget { [weak self] _ in
            Task { @MainActor in if self?.isPlaying == true { self?.toggle() } }
            return .success
        }
        center.nextTrackCommand.addTarget { [weak self] _ in
            Task { @MainActor in self?.next() }
            return .success
        }
        center.previousTrackCommand.addTarget { [weak self] _ in
            Task { @MainActor in self?.previous() }
            return .success
        }
    }

    private func updateNowPlaying() {
        guard let track = current else { return }
        MPNowPlayingInfoCenter.default().nowPlayingInfo = [
            MPMediaItemPropertyTitle: track.title,
            MPMediaItemPropertyArtist: track.artist,
            MPMediaItemPropertyPlaybackDuration: duration,
            MPNowPlayingInfoPropertyElapsedPlaybackTime: position,
            MPNowPlayingInfoPropertyPlaybackRate: isPlaying ? 1.0 : 0.0
        ]
    }
}
