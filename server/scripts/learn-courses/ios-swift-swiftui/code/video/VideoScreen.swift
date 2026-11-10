import SwiftUI
import AVKit

struct VideoScreen: View {
    @State private var model = VideoModel()
    @State private var selected = SampleVideos.all[0]
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        VStack(spacing: 0) {
            ZStack {
                VideoPlayer(player: model.player)
                    .aspectRatio(16 / 9, contentMode: .fit)
                if model.status == .loading {
                    ProgressView().tint(.white)
                }
                if model.status == .failed {
                    Text("This video cannot be played right now.")
                        .foregroundStyle(.white)
                        .padding()
                        .background(.black.opacity(0.7), in: RoundedRectangle(cornerRadius: 8))
                }
            }
            .background(Color.black)

            Text(selected.title)
                .font(.headline)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()

            List(SampleVideos.all) { video in
                Button {
                    selected = video
                    model.play(video)
                } label: {
                    VStack(alignment: .leading) {
                        Text(video.title)
                        Text(video.note).font(.caption).foregroundStyle(.secondary)
                    }
                }
            }
            .listStyle(.plain)
        }
        .onAppear { model.play(selected) }
        .onDisappear { model.stop() }
        .onChange(of: scenePhase) { _, phase in
            // Pause when the app goes to the background (unless you add background video later).
            if phase != .active { model.player.pause() }
        }
    }
}
