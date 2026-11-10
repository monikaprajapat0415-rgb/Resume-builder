import SwiftUI

struct HabitView: View {
    @State private var store = HabitStore()
    @State private var newName = ""

    var body: some View {
        NavigationStack {
            List {
                Section {
                    HStack {
                        TextField("New habit, e.g. Read 10 pages", text: $newName)
                            .onSubmit(add)
                        Button("Add", action: add)
                    }
                }
                Section {
                    if store.habits.isEmpty {
                        Text("No habits yet. Add one above.")
                            .foregroundStyle(.secondary)
                    }
                    ForEach(store.habits) { habit in
                        HStack {
                            VStack(alignment: .leading) {
                                Text(habit.name)
                                Text("Streak: \(habit.currentStreak()) day(s)")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            Button {
                                store.toggleToday(habit)
                            } label: {
                                Image(systemName: habit.isDone(on: .now) ? "checkmark.circle.fill" : "circle")
                                    .font(.title2)
                            }
                            .buttonStyle(.plain)
                            .accessibilityLabel(habit.isDone(on: .now) ? "Done today" : "Mark done today")
                        }
                    }
                    .onDelete(perform: store.delete)
                }
            }
            .navigationTitle("Habits")
        }
    }

    private func add() {
        store.add(name: newName)
        newName = ""
    }
}
