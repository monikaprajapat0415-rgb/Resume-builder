import Foundation
import SwiftData

@Model
final class TodoItem {
    var title: String
    var isDone: Bool
    var createdAt: Date

    init(title: String, isDone: Bool = false, createdAt: Date = .now) {
        self.title = title
        self.isDone = isDone
        self.createdAt = createdAt
    }
}

enum TodoFilter: String, CaseIterable, Identifiable {
    case all = "All"
    case open = "Open"
    case done = "Done"

    var id: String { rawValue }

    func apply(to items: [TodoItem]) -> [TodoItem] {
        switch self {
        case .all: return items
        case .open: return items.filter { !$0.isDone }
        case .done: return items.filter { $0.isDone }
        }
    }
}
