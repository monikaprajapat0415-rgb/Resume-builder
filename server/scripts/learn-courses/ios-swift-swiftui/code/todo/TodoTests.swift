import Testing
import SwiftData
@testable import Todo

struct TodoTests {
    private func makeContext() throws -> ModelContext {
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        let container = try ModelContainer(for: TodoItem.self, configurations: config)
        return ModelContext(container)
    }

    @Test func savedItemsComeBack() throws {
        let context = try makeContext()
        context.insert(TodoItem(title: "Buy milk"))
        context.insert(TodoItem(title: "Call Asha", isDone: true))
        try context.save()

        let all = try context.fetch(FetchDescriptor<TodoItem>())
        #expect(all.count == 2)
    }

    @Test func filterSeparatesOpenAndDone() {
        let items = [TodoItem(title: "A"), TodoItem(title: "B", isDone: true)]
        #expect(TodoFilter.open.apply(to: items).map(\.title) == ["A"])
        #expect(TodoFilter.done.apply(to: items).map(\.title) == ["B"])
        #expect(TodoFilter.all.apply(to: items).count == 2)
    }
}
