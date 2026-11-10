import SwiftUI

struct PlayerView: View {
    @State private var player = AudioPlayer()
    @State private var dragPosition: Double?

    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            Image(systemName: "music.note")
                .font(.system(size: 80))
                .frame(width: 220, height: 220)
                .background(Color.blue.opacity(0.15), in: RoundedRectangle(cornerRadius: 24))
            VStack(spacing: 4) {
                Text(player.current?.title ?? "No track").font(.title2.bold())
                Text(player.current?.artist ?? "").foregroundStyle(.secondary)
            }

            if let message = player.errorMessage {
                Text(message).foregroundStyle(.red)
            }

            VStack {
                Slider(
                    value: Binding(
                        get: { dragPosition ?? player.position },
                        set: { dragPosition = $0 }
                    ),
                    in: 0...max(player.duration, 1)
                ) { editing in
                    if !editing, let target = dragPosition {
                        player.seek(to: target)
                        dragPosition = nil
                    }
                }
                HStack {
                    Text(TimeFormat.clock(dragPosition ?? player.position))
                    Spacer()
                    Text(TimeFormat.clock(player.duration))
                }
                .font(.caption.monospacedDigit())
                .foregroundStyle(.secondary)
            }

            HStack(spacing: 40) {
                Button { player.previous() } label: { Image(systemName: "backward.fill") }
                    .accessibilityLabel("Previous track")
                Button { player.toggle() } label: {
                    Image(systemName: player.isPlaying ? "pause.circle.fill" : "play.circle.fill")
                        .font(.system(size: 64))
                }
                .accessibilityLabel(player.isPlaying ? "Pause" : "Play")
                Button { player.next() } label: { Image(systemName: "forward.fill") }
                    .accessibilityLabel("Next track")
            }
            .font(.title)
            Spacer()
        }
        .padding()
    }
}
