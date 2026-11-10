import SwiftUI
import SwiftData

struct TodoListView: View {
    @Environment(\.modelContext) private var context
    @Query(sort: \TodoItem.createdAt, order: .reverse) private var items: [TodoItem]

    @State private var newTitle = ""
    @State private var filter: TodoFilter = .all

    private var canAdd: Bool {
        !newTitle.trimmingCharacters(in: .whitespaces).isEmpty
    }

    var body: some View {
        NavigationStack {
            List {
                Section {
                    HStack {
                        TextField("New task", text: $newTitle)
                            .onSubmit(add)
                        Button("Add", action: add)
                            .disabled(!canAdd)
                    }
                    Picker("Show", selection: $filter) {
                        ForEach(TodoFilter.allCases) { option in
                            Text(option.rawValue).tag(option)
                        }
                    }
                    .pickerStyle(.segmented)
                }

                Section {
                    let shown = filter.apply(to: items)
                    if shown.isEmpty {
                        Text("Nothing here yet.")
                            .foregroundStyle(.secondary)
                    }
                    ForEach(shown) { item in
                        Button {
                            item.isDone.toggle()
                        } label: {
                            HStack {
                                Image(systemName: item.isDone ? "checkmark.circle.fill" : "circle")
                                Text(item.title)
                                    .strikethrough(item.isDone)
                                    .foregroundStyle(item.isDone ? .secondary : .primary)
                            }
                        }
                        .buttonStyle(.plain)
                    }
                    .onDelete(perform: delete)
                }
            }
            .navigationTitle("To-Do")
        }
    }

    private func add() {
        guard canAdd else { return }
        context.insert(TodoItem(title: newTitle.trimmingCharacters(in: .whitespaces)))
        newTitle = ""
    }

    private func delete(at offsets: IndexSet) {
        let shown = filter.apply(to: items)
        for index in offsets {
            context.delete(shown[index])
        }
    }
}
