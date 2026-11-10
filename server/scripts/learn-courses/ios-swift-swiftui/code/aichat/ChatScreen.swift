import SwiftUI

struct ChatScreen: View {
    @State private var model: ChatViewModel
    @State private var input = ""

    init(service: AIService) {
        _model = State(initialValue: ChatViewModel(service: service))
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                Text("AI answers can be wrong. Check important facts.")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .padding(.vertical, 4)

                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(alignment: .leading, spacing: 10) {
                            ForEach(model.messages) { message in
                                bubble(message.text, mine: message.role == .user)
                                    .id(message.id)
                            }
                            if let live = model.streaming {
                                bubble(live.isEmpty ? "..." : live + " ▌", mine: false)
                                    .id("live")
                            }
                            if let error = model.errorText {
                                Text(error).foregroundStyle(.red).font(.callout)
                            }
                        }
                        .padding()
                    }
                    .onChange(of: model.messages.count) { _, _ in
                        if let last = model.messages.last { proxy.scrollTo(last.id, anchor: .bottom) }
                    }
                    .onChange(of: model.streaming) { _, _ in
                        proxy.scrollTo("live", anchor: .bottom)
                    }
                }

                HStack {
                    TextField("Ask something", text: $input, axis: .vertical)
                        .textFieldStyle(.roundedBorder)
                        .lineLimit(1...4)
                    if model.isReplying {
                        Button("Stop") { model.stop() }
                    } else {
                        Button("Send") {
                            model.send(input)
                            input = ""
                        }
                        .disabled(input.trimmingCharacters(in: .whitespaces).isEmpty)
                    }
                }
                .padding()
            }
            .navigationTitle("Assistant")
            .toolbar {
                Button("Clear", role: .destructive) { model.clear() }
            }
        }
    }

    private func bubble(_ text: String, mine: Bool) -> some View {
        Text(text)
            .padding(10)
            .background(mine ? Color.blue : Color(.secondarySystemBackground),
                        in: RoundedRectangle(cornerRadius: 14))
            .foregroundStyle(mine ? Color.white : Color.primary)
            .frame(maxWidth: .infinity, alignment: mine ? .trailing : .leading)
    }
}
