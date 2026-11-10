import SwiftUI

struct JobListView: View {
    @State private var model: JobViewModel

    init(service: JobService) {
        _model = State(initialValue: JobViewModel(service: service))
    }

    var body: some View {
        NavigationStack {
            Group {
                switch model.state {
                case .loading:
                    ProgressView("Loading jobs...")
                case .failed:
                    VStack(spacing: 12) {
                        Text("Could not load jobs.")
                        Button("Try again") { Task { await model.load() } }
                            .buttonStyle(.borderedProminent)
                    }
                case .ready:
                    list
                }
            }
            .navigationTitle("Jobs")
            .searchable(text: $model.filter.text, prompt: "Title, company or place")
            .navigationDestination(for: Job.self) { JobDetailView(job: $0, model: model) }
        }
        .task { await model.load() }
    }

    private var list: some View {
        List {
            Section {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack {
                        Toggle("Remote", isOn: $model.filter.remoteOnly)
                            .toggleStyle(.button)
                        ForEach(JobType.allCases) { type in
                            Toggle(type.rawValue, isOn: binding(for: type))
                                .toggleStyle(.button)
                        }
                    }
                }
            }
            Section {
                if model.shown.isEmpty {
                    Text("No jobs match your search.").foregroundStyle(.secondary)
                }
                ForEach(model.shown) { job in
                    NavigationLink(value: job) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(job.title).font(.headline)
                            Text("\(job.company) · \(job.location)").font(.subheadline)
                            Text(job.type.rawValue + (job.remote ? " · Remote" : ""))
                                .font(.caption).foregroundStyle(.secondary)
                        }
                    }
                }
            }
        }
    }

    private func binding(for type: JobType) -> Binding<Bool> {
        Binding(
            get: { model.filter.types.contains(type) },
            set: { isOn in
                if isOn { model.filter.types.insert(type) } else { model.filter.types.remove(type) }
            }
        )
    }
}

struct JobDetailView: View {
    let job: Job
    let model: JobViewModel

    @State private var note = ""
    @State private var pickedFile: URL?
    @State private var showPicker = false
    @State private var sending = false
    @State private var message: String?

    var body: some View {
        Form {
            Section("About the job") {
                Text(job.description)
            }
            Section("Your application") {
                TextField("Short cover note", text: $note, axis: .vertical)
                    .lineLimit(2...5)
                Button(pickedFile?.lastPathComponent ?? "Choose resume") { showPicker = true }
                Button(sending ? "Sending..." : "Apply") {
                    guard let file = pickedFile else { return }
                    Task {
                        sending = true
                        message = await model.apply(to: job, note: note, fileURL: file) ?? "Application sent"
                        sending = false
                    }
                }
                .disabled(pickedFile == nil || sending)
                if let message {
                    Text(message).font(.callout)
                }
            }
        }
        .navigationTitle(job.title)
        .fileImporter(isPresented: $showPicker, allowedContentTypes: ResumeRules.contentTypes) { result in
            if case .success(let url) = result { pickedFile = url }
        }
    }
}
