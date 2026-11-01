import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

// String.raw keeps Swift's backslash-parenthesis interpolation and key paths exactly as written.
const S = String.raw;
const S3 = 'SwiftUI';
const S4 = 'Concurrency';

export const lessons = [
  // ---------------------------------------------------------------- 6
  les(S3, 'swiftui-views-modifiers-and-stacks', 'SwiftUI Views, Modifiers and Stacks: Build a Layout', 'SwiftUI Views, Modifiers and Stacks',
    'Learn how SwiftUI builds screens from small views, how modifiers and their order change the result, and how VStack, HStack, ZStack and Spacer lay things out.', [
    P("From this lesson on we build screens. SwiftUI has one big idea: a screen is a *function of its data*. You describe what the screen should look like for the current data, and SwiftUI redraws it whenever the data changes. You do not move buttons around by hand. This is called **declarative** UI, and it is the reason SwiftUI code is short."),
    H("Everything is a view"),
    P("A **view** is a small piece of the screen: some text, an image, a button, a list, or a group of other views. A view is a struct that follows the `View` protocol and has a `body` property. The word `some View` means *a view of some kind, and the compiler works out which*. Views are cheap, so SwiftUI expects you to make many small ones and combine them."),
    C('swift', S`import SwiftUI

struct ExpenseRow: View {
    let title: String
    let amount: Double

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "cart.fill")
                .foregroundStyle(.white)
                .frame(width: 36, height: 36)
                .background(.blue, in: Circle())

            VStack(alignment: .leading) {
                Text(title).font(.headline)
                Text("Today").font(.caption).foregroundStyle(.secondary)
            }

            Spacer()

            Text(amount, format: .currency(code: "USD"))
                .font(.headline)
        }
        .padding()
    }
}

#Preview {
    ExpenseRow(title: "Groceries", amount: 42.8)
}`),
    P("Read it from the outside in. An `HStack` puts things side by side. It holds an icon, a `VStack` with two lines of text, a `Spacer` and the amount. The `Spacer` is a flexible gap that pushes the amount to the right edge. `Image(systemName:)` uses **SF Symbols**, thousands of free icons that come with Apple's systems. The Mac app named SF Symbols lets you browse them. `Text(amount, format: .currency(code: \"USD\"))` shows a number as money, and the currency code is a parameter, so you can change it."),
    H("The three stacks"),
    L("`VStack` lays views out **vertically**, top to bottom.", "`HStack` lays views out **horizontally**, left to right. In languages that read right to left, SwiftUI flips this for you.", "`ZStack` layers views **on top of each other**, with the first at the back. Use it for a badge on an image, or text over a colour.", "Each stack takes `alignment` and `spacing`. `Spacer()` takes up all the space it can. `Divider()` draws a thin line."),
    H("Modifiers"),
    P("A **modifier** is a method that returns a changed copy of a view: `.font`, `.padding`, `.background`, `.frame`, `.foregroundStyle`, `.cornerRadius` and many more. You chain them, one after another. The surprise for beginners is that **the order matters**, because each modifier wraps the result of the one before it."),
    C('swift', S`// Background first, then padding: the yellow stays tight around the text.
Text("Hello")
    .background(.yellow)
    .padding()

// Padding first, then background: the yellow includes the padding.
Text("Hello")
    .padding()
    .background(.yellow)`),
    P("Try both in the preview and look at the difference. When a layout looks wrong, the order of modifiers is the first thing to check. Some modifiers, such as `.font`, pass down to every view inside a stack, so you can set a font once on a `VStack` and not on each line."),
    H("Frames, sizes and safe areas"),
    P("Views take as little space as they need. Use `.frame(width:height:)` for a fixed size, or `.frame(maxWidth: .infinity)` to stretch to the full width. A screen on an iPhone has **safe areas**, the parts not hidden by the notch, the rounded corners or the home bar. SwiftUI keeps your content inside them by default, which is what you want for text. A background colour often should go behind them, and `.ignoresSafeArea()` lets it."),
    C('swift', S`struct SummaryCard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("This month")
                .font(.subheadline)
                .foregroundStyle(.secondary)
            Text(1240.5, format: .currency(code: "USD"))
                .font(.largeTitle.bold())
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 16))
        .padding(.horizontal)
    }
}`),
    H("Small views are a good habit"),
    L("When a `body` is longer than about 30 lines, cut a piece out into its own struct, like `ExpenseRow` above. Smaller views are easier to read and to preview.", "Give a view only the data it needs, in `let` properties. That makes it easy to reuse and to test with a preview.", "Use **semantic** styles such as `.font(.headline)` and `.foregroundStyle(.secondary)`, and not fixed sizes and colours. They adapt to Dark Mode and to people who set larger text in their phone's settings, which is part of making an app accessible."),
    N("Colours, fonts and sizes you pick should still look right in Dark Mode and with larger text. In Xcode's preview you can switch both on, and it takes a minute. It is a habit worth building from the start, and it matters for accessibility."),
    H("Common mistakes"),
    L("A view with more than ten direct children in one stack. Group them with `Group` or split them into smaller views.", "Forgetting that `Spacer` only expands inside a stack.", "Fixed frame sizes for text. A bigger font makes the text cut off."),
    ...task("Create a new SwiftUI file called `ExpenseRow.swift` with the row above and change the icon and colours.", "Create `SummaryCard` and show it above the row inside a `VStack` in `ContentView`.", "Swap the order of `.padding()` and `.background()` and write down what changes.", "Turn on Dark Mode and a larger text size in the preview, and fix anything that looks wrong."),
    ...check("The row shows an icon on the left, two lines of text, and the amount pushed to the right edge.", "You can explain why modifier order matters with an example.", "Your screen still looks fine in Dark Mode."),
  ], A('Stacks and modifiers', [
    n('v', 'Text view', 'Text("Hello")', 0, 0, 'data'), n('m1', '.padding()', 'wraps the view', 1, 0, 'tool'),
    n('m2', '.background()', 'wraps again', 2, 0, 'tool'), n('screen', 'On screen', 'order decides', 3, 0, 'out'),
  ], [
    { say: 'You start with a simple view such as Text.', on: ['v'] },
    { say: 'Each modifier returns a new view that wraps the one before it. Padding adds space around the text.', flow: ['v>m1:wrapped'] },
    { say: 'The background then paints the padded area as well. Swap them and the yellow shrinks.', flow: ['m1>m2:wrapped'] },
    { say: 'What you see depends on the order of the modifiers, so read them from top to bottom.', flow: ['m2>screen:draws'] },
  ]), [
    faq('What is a view in SwiftUI?', 'A small piece of the screen, written as a struct with a body property. Views are cheap, so you combine many small ones into a screen.'),
    faq('Why does modifier order matter in SwiftUI?', 'Each modifier wraps the result of the one before it. Padding then background paints the padded area, while background then padding paints only the content.'),
    faq('What is an SF Symbol?', 'One of thousands of free icons built into Apple systems, used with Image(systemName:). The SF Symbols app from Apple lets you browse them.'),
  ]),

  // ---------------------------------------------------------------- 7
  les(S3, 'swiftui-state-binding-buttons-and-textfields', 'SwiftUI State and Binding: @State, Button and TextField', 'SwiftUI @State, @Binding and TextField',
    'Learn how SwiftUI remembers data with @State, shares it with child views through @Binding, and connects buttons, text fields and toggles with the dollar sign.', [
    P("A screen that never changes is only a picture. To react to taps and typing, SwiftUI needs a place to keep changing data. That place is **state**. The rule of SwiftUI is simple and strict: *when state changes, the views that read it are drawn again*. You never say *update this label*. You only change the data."),
    H("@State"),
    P("A view is a struct, and structs are values that SwiftUI creates and throws away often. So an ordinary `var` inside a view would be lost. Putting `@State` in front of a property tells SwiftUI to keep that value safely for the life of the view and to redraw the view when it changes. By habit, state is `private`, because the view that owns it is the one that changes it."),
    C('swift', S`struct CounterView: View {
    @State private var count = 0

    var body: some View {
        VStack(spacing: 16) {
            Text("Taps: \(count)")
                .font(.title)

            Button("Add one") {
                count += 1
            }
            .buttonStyle(.borderedProminent)

            Button("Reset", role: .destructive) {
                count = 0
            }
        }
        .padding()
    }
}`),
    P("The closure after `Button(\"Add one\")` is the code that runs on a tap. It changes `count`. SwiftUI sees the change and draws the `Text` again with the new number. There is no other step. Notice `role: .destructive`, which makes the button red, because a button that throws things away should look different."),
    H("The dollar sign: bindings"),
    P("A text field must both *show* a value and *change* it when the user types. A plain value cannot do the second job. A **binding** is a two-way connection to a value that lives somewhere else. You make one from a state property by putting a dollar sign in front of its name."),
    C('swift', S`struct AddExpenseForm: View {
    @State private var title = ""
    @State private var amountText = ""
    @State private var isRecurring = false

    var body: some View {
        VStack(spacing: 12) {
            TextField("What did you buy?", text: $title)
                .textFieldStyle(.roundedBorder)

            TextField("Amount", text: $amountText)
                .textFieldStyle(.roundedBorder)
                .keyboardType(.decimalPad)

            Toggle("Repeats every month", isOn: $isRecurring)

            Text("You typed: \(title)")
                .foregroundStyle(.secondary)
        }
        .padding()
    }
}`),
    L("`title` (no dollar sign) is the value. Use it to *read*.", "`$title` is a binding. Use it to let another view *read and write* the same value, as `TextField` and `Toggle` do.", "As you type, the text field writes to `title`, SwiftUI notices, and the `Text` below updates on each key press."),
    H("@Binding: sharing state with a child view"),
    P("When you split a form into smaller views, the child needs to change the parent's data. Give the child a `@Binding` property. The parent passes `$value`, and the child reads and writes it, without owning it. There is still only one real copy of the data, which is why the parent and child can never disagree."),
    C('swift', S`struct AmountField: View {
    @Binding var text: String

    var body: some View {
        HStack {
            Text("$")
            TextField("0.00", text: $text)
                .keyboardType(.decimalPad)
        }
        .padding(10)
        .background(.quaternary, in: RoundedRectangle(cornerRadius: 10))
    }
}

struct ParentView: View {
    @State private var amountText = ""

    var body: some View {
        VStack {
            AmountField(text: $amountText)
            Text("Value: \(amountText)")
        }
        .padding()
    }
}`),
    H("Turning text into a number"),
    P("A text field holds a `String`, but an amount is a `Double`. Lesson 5 gave you the tool: `Double(amountText)` returns an optional. Use it to decide whether the form is valid, and disable the button when it is not."),
    C('swift', S`private var amount: Double? { Double(amountText) }
private var isValid: Bool {
    !title.trimmingCharacters(in: .whitespaces).isEmpty && (amount ?? 0) > 0
}

// in body:
Button("Add expense") {
    // save it
}
.disabled(!isValid)`),
    N("Decimal separators differ by country. Some regions type a comma, and `Double(\"4,5\")` is `nil`. For a real app, prefer `TextField(\"Amount\", value: $amount, format: .number)` with a `Double` state, which follows the user's region. We keep the text version here so you can see how the pieces connect."),
    H("What should be state?"),
    L("Data that changes and that the screen shows: a counter, a text field's text, whether a sheet is open.", "Not data that can be worked out from other state. A total is a *computed property*, not a second state value. Two copies of one fact can go out of step.", "Keep state as low as you can and as local as you can. If two views need to change it, put it in their nearest shared parent and pass a binding."),
    H("Common mistakes"),
    L("Changing a `var` property that has no `@State`. The screen does not update, and Xcode may refuse to compile it.", "Forgetting the dollar sign in `TextField(text: title)`. The error says it expected a `Binding<String>`.", "Putting state in a child view when the parent also needs it."),
    ...task("Build `CounterView` and add a button that subtracts one but never goes below zero.", "Build the form with title, amount and a toggle, and show a live summary line under it.", "Move the amount field into its own view with `@Binding`.", "Disable the Add button until the title is not empty and the amount is above zero."),
    ...check("Typing in the field updates the summary line on every key press.", "The button turns on only when the form is valid.", "You can say what `@State`, `$title` and `@Binding` each do."),
  ], A('State drives the screen', [
    n('tap', 'User taps', 'Button action', 0, 0, 'user'), n('state', '@State count', 'the data changes', 1, 0, 'data'),
    n('sui', 'SwiftUI', 'sees the change', 2, 0, 'tool'), n('view', 'View redraws', 'Text shows new value', 3, 0, 'out'),
  ], [
    { say: 'The user taps a button or types in a field.', on: ['tap'] },
    { say: 'Your code changes a @State value. You only change data, never the label.', flow: ['tap>state:count += 1'] },
    { say: 'SwiftUI notices that a value used by the view has changed.', flow: ['state>sui:changed'] },
    { say: 'The view body runs again and the screen shows the new value.', flow: ['sui>view:redraw'] },
  ]), [
    faq('What does @State do in SwiftUI?', 'It tells SwiftUI to keep a value safely for the life of the view and to redraw the view whenever the value changes. State is usually private to the view that owns it.'),
    faq('What does the dollar sign mean in $title?', 'It makes a binding, a two-way link to the value, so a control such as a TextField can both show it and change it.'),
    faq('When do I use @Binding?', 'When a child view needs to change data that is owned by its parent. The parent passes $value and the child declares @Binding, so there is still only one copy of the data.'),
  ]),

  // ---------------------------------------------------------------- 8
  les(S3, 'swiftui-lists-navigationstack-and-sheets', 'SwiftUI Lists, NavigationStack and Sheets', 'SwiftUI List, NavigationStack and Sheets',
    'Build a list screen with List and ForEach, move to a detail screen with NavigationStack, open an add screen in a sheet, and let users swipe to delete.', [
    P("Almost every app is a list that leads to detail screens. In this lesson the Expense Tracker gets its first real structure: a list of expenses, a detail screen for each, and a sheet to add a new one. For now the data lives in memory, so it disappears when you close the app. Lesson 12 fixes that with SwiftData."),
    H("The model"),
    P("A list needs to tell its rows apart, so each row needs a stable identity. We make the model `Identifiable`, with a `UUID` as the `id`. We also add `Hashable`, which navigation needs to remember which item was picked. A struct whose properties are all `Hashable` gets this for free."),
    C('swift', S`import SwiftUI

enum Category: String, CaseIterable {
    case food = "Food", travel = "Travel", fun = "Fun", other = "Other"
}

struct Expense: Identifiable, Hashable {
    let id = UUID()
    var title: String
    var amount: Double
    var category: Category = .other
}`),
    H("List and ForEach"),
    P("`List` shows rows that scroll, with the usual iPhone look. If you give it an array of identifiable items, it makes one row per item. Use `ForEach` inside a `List` when you want extras such as swipe to delete, or when the list has sections."),
    C('swift', S`struct ExpenseListView: View {
    @State private var expenses: [Expense] = [
        Expense(title: "Groceries", amount: 42.8, category: .food),
        Expense(title: "Bus pass", amount: 25, category: .travel),
        Expense(title: "Cinema", amount: 12.5, category: .fun)
    ]
    @State private var showAdd = false

    var body: some View {
        NavigationStack {
            List {
                ForEach(expenses) { expense in
                    NavigationLink(value: expense) {
                        HStack {
                            Text(expense.title)
                            Spacer()
                            Text(expense.amount, format: .currency(code: "USD"))
                                .foregroundStyle(.secondary)
                        }
                    }
                }
                .onDelete { offsets in
                    expenses.remove(atOffsets: offsets)
                }
            }
            .navigationTitle("Expenses")
            .navigationDestination(for: Expense.self) { expense in
                ExpenseDetailView(expense: expense)
            }
            .toolbar {
                Button("Add", systemImage: "plus") { showAdd = true }
            }
            .sheet(isPresented: $showAdd) {
                AddExpenseView { newExpense in
                    expenses.append(newExpense)
                }
            }
        }
    }
}`),
    P("Take the pieces one at a time."),
    L("**`NavigationStack`** is the container for a stack of screens. It gives you the title bar and the back button for free.", "**`NavigationLink(value:)`** makes a row tappable and says *which item was chosen*. The matching **`navigationDestination(for:)`** says *which screen to show for that kind of item*. This pairing keeps navigation tidy even in big apps.", "**`.onDelete`** adds swipe to delete on a `ForEach`. SwiftUI gives you the positions to remove.", "**`.toolbar`** places buttons in the navigation bar. A `Button` with a `systemImage` shows an icon and keeps its text for accessibility.", "**`.sheet(isPresented:)`** slides a screen up from the bottom while the boolean is true. Because we pass `$showAdd`, the sheet can set it back to false when it closes."),
    H("The detail screen"),
    C('swift', S`struct ExpenseDetailView: View {
    let expense: Expense

    var body: some View {
        VStack(spacing: 8) {
            Text(expense.amount, format: .currency(code: "USD"))
                .font(.largeTitle.bold())
            Text(expense.title).font(.title3)
            Text(expense.category.rawValue)
                .padding(.horizontal, 10).padding(.vertical, 4)
                .background(.blue.opacity(0.15), in: Capsule())
            Spacer()
        }
        .padding()
        .navigationTitle(expense.title)
        .navigationBarTitleDisplayMode(.inline)
    }
}`),
    H("The sheet that adds an expense"),
    P("The sheet needs to hand the new expense back. A simple way is to pass a closure, a function the sheet calls when the user taps Save. The sheet also uses the `dismiss` action from the environment to close itself. `@Environment` reads values the system provides, such as the dismiss action, the colour scheme or the text size."),
    C('swift', S`struct AddExpenseView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var title = ""
    @State private var amountText = ""

    var onSave: (Expense) -> Void

    var body: some View {
        NavigationStack {
            VStack(spacing: 12) {
                TextField("Title", text: $title)
                    .textFieldStyle(.roundedBorder)
                TextField("Amount", text: $amountText)
                    .textFieldStyle(.roundedBorder)
                    .keyboardType(.decimalPad)
                Spacer()
            }
            .padding()
            .navigationTitle("New expense")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        if let amount = Double(amountText), !title.isEmpty {
                            onSave(Expense(title: title, amount: amount))
                            dismiss()
                        }
                    }
                }
            }
        }
    }
}`),
    N("Older tutorials use `NavigationView` and `NavigationLink(destination:)`. Both still work but are deprecated for new code. Use `NavigationStack`, as above. If you see the older names, the idea is the same."),
    H("How the pieces fit together"),
    P("Follow one tap through the code to see why it works. The user taps a row. The `NavigationLink` hands the chosen `Expense` to the `NavigationStack`. The stack looks for a `navigationDestination` that accepts the type `Expense`, builds `ExpenseDetailView` with that value and pushes it on screen. Pressing back removes it again. Nothing in the list needs to know what the detail screen looks like, and the detail screen does not need to know where the user came from. This separation is the reason value-based navigation scales to large apps, and also the reason a deep link or a saved navigation path can open any screen later."),
    P("The same thinking applies to the sheet. The list owns the boolean `showAdd` and the array. The sheet owns only what the user is typing. It gives back one finished value through the closure, and the list decides what to do with it. Each view has one job and a clear way to talk to its neighbours, and that is what makes the screens easy to change one at a time."),
    H("Common mistakes"),
    L("An array of items without a stable `id`, or with an `id` that changes each time. Rows jump around or lose their state.", "Putting a `NavigationLink` inside another navigation container by accident, which makes two title bars.", "Forgetting that the data here is only in memory. Close the app and it resets. That is expected until lesson 12."),
    ...task("Type the three views into your project and run the app.", "Add a category `Picker` to the sheet using `ForEach(Category.allCases, id: \\.self)`.", "Show the total of all expenses at the top of the list in a `Section`.", "Add an empty state: when the array is empty, show a `Text(\"No expenses yet\")` instead of a blank list."),
    ...check("Tapping a row opens the detail screen and the back button returns.", "The sheet adds a new row and closes. Swiping a row deletes it.", "You can explain what `NavigationLink(value:)` and `navigationDestination(for:)` do together."),
  ], A('List to detail', [
    n('list', 'List', 'one row per item', 0, 0, 'app'), n('link', 'NavigationLink', 'sends the item', 1, 0, 'tool'),
    n('dest', 'navigationDestination', 'picks a screen', 2, 0, 'check'), n('detail', 'Detail screen', 'shows the item', 3, 0, 'out'),
  ], [
    { say: 'A List shows one row for each item in your array.', on: ['list'] },
    { say: 'Tapping a row sends the chosen item through its NavigationLink.', flow: ['list>link:tap'] },
    { say: 'navigationDestination decides which screen belongs to that type of item.', flow: ['link>dest:value'] },
    { say: 'The detail screen opens with the item, and the back button comes for free.', flow: ['dest>detail:push'] },
  ]), [
    faq('What is the difference between List and ForEach?', 'List is the scrolling container with the standard look. ForEach makes views from a collection and works inside List, which lets you add swipe to delete or sections.'),
    faq('Should I use NavigationView or NavigationStack?', 'NavigationStack. NavigationView is deprecated for new code. NavigationStack supports value-based links and programmatic navigation.'),
    faq('Why must list items be Identifiable?', 'SwiftUI needs a stable id for each row to know which row is which when data changes. Identifiable types provide that id, and a UUID is a simple way to make one.'),
  ]),

  // ---------------------------------------------------------------- 9
  les(S3, 'swiftui-forms-pickers-validation-and-animation', 'SwiftUI Forms, Pickers, Validation and Animation', 'SwiftUI Forms, Pickers and Animation',
    'Build a proper settings-style form with Picker and DatePicker, check the input before saving, show errors clearly, and add smooth animation with withAnimation.', [
    P("The add screen from lesson 8 works, but it looks plain, and a user could save an empty title or a negative amount. In this lesson we replace it with a real form, check the input, and add a little motion so changes feel natural and not abrupt. These are the finishing touches that make an app feel made with care."),
    H("Form and Section"),
    P("`Form` is a container that gives its content the grouped, settings-app look, and it adapts to the platform. Inside it, `Section` groups related rows under a header and a footer. Controls inside a form pick up the right spacing for free."),
    C('swift', S`struct ExpenseFormView: View {
    @Environment(\.dismiss) private var dismiss

    @State private var title = ""
    @State private var amount = 0.0
    @State private var category: Category = .other
    @State private var date = Date()
    @State private var note = ""
    @State private var triedToSave = false

    var onSave: (Expense) -> Void

    private var titleError: String? {
        title.trimmingCharacters(in: .whitespaces).isEmpty ? "Please enter a title." : nil
    }
    private var amountError: String? {
        amount <= 0 ? "The amount must be more than zero." : nil
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Details") {
                    TextField("Title", text: $title)
                    if triedToSave, let titleError {
                        Text(titleError).font(.caption).foregroundStyle(.red)
                    }

                    TextField("Amount", value: $amount, format: .number)
                        .keyboardType(.decimalPad)
                    if triedToSave, let amountError {
                        Text(amountError).font(.caption).foregroundStyle(.red)
                    }
                }

                Section("More") {
                    Picker("Category", selection: $category) {
                        ForEach(Category.allCases, id: \.self) { c in
                            Text(c.rawValue).tag(c)
                        }
                    }
                    DatePicker("Date", selection: $date, displayedComponents: .date)
                    TextField("Note (optional)", text: $note, axis: .vertical)
                        .lineLimit(1...4)
                }
            }
            .navigationTitle("New expense")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { save() }
                }
            }
        }
    }

    private func save() {
        triedToSave = true
        guard titleError == nil, amountError == nil else { return }
        onSave(Expense(title: title, amount: amount, category: category))
        dismiss()
    }
}`),
    P("There is a lot here, so here is what to notice."),
    L("**`Picker`** needs a binding to the selected value and a list of choices. Each choice has a `tag` that matches the type of the selection. With an enum that conforms to `CaseIterable`, `ForEach(Category.allCases)` builds the whole list for you.", "**`DatePicker`** gives the native date control. `displayedComponents: .date` hides the time.", "**`TextField(value:format:)`** edits a number directly, and it follows the user's region for decimal marks. It replaces the `Double(text)` step from lesson 7. The field shows `0` at first, and in a real app you may prefer an optional state value or a placeholder.", "**`if let titleError`** is the short form of unwrapping that works in modern Swift. It shows the message only when there is one.", "**Validation** lives in small computed properties, and a `save()` function checks them. We show errors only after the first try to save, so the form does not shout at someone who has not typed anything yet."),
    H("Good form habits"),
    L("Say what is wrong in plain words and next to the field, not in a pop-up.", "Do the checks again where the data is saved, not only on the screen. In lesson 14 you will test the same rules without any screen.", "Never rely on a field's keyboard type to keep out bad input. People can paste.", "Mark which fields are optional."),
    H("Accessibility of forms"),
    P("A form is where accessibility matters most, because people must read labels and enter data. Give every field a visible label or a clear placeholder. The built-in controls already work with VoiceOver, Apple's screen reader, and with larger text sizes, so avoid replacing them with custom ones unless you need to. When you do build a custom control, add `.accessibilityLabel(\"...\")` so that it is announced with a meaningful name. Test once by turning VoiceOver on in the Simulator or on a device, and listen to how your form sounds."),
    H("Animation"),
    P("SwiftUI can animate almost any change in state. The simplest tool is `withAnimation`. Wrap the state change in it and every view that depends on that state moves smoothly to its new look. A second tool is the `.animation(_:value:)` modifier, which animates whenever one particular value changes."),
    C('swift', S`struct ExpandableNote: View {
    @State private var expanded = false
    @State private var liked = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Button {
                withAnimation(.easeInOut) { expanded.toggle() }
            } label: {
                Label(expanded ? "Hide details" : "Show details",
                      systemImage: expanded ? "chevron.up" : "chevron.down")
            }

            if expanded {
                Text("Receipts help you check your spending at the end of the month.")
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }

            Image(systemName: liked ? "heart.fill" : "heart")
                .font(.largeTitle)
                .foregroundStyle(liked ? .red : .gray)
                .scaleEffect(liked ? 1.2 : 1)
                .animation(.easeInOut(duration: 0.2), value: liked)
                .onTapGesture { liked.toggle() }
        }
        .padding()
    }
}`),
    L("`withAnimation { ... }` animates everything that changes because of the code inside.", "A **transition** says how a view appears and disappears, as in `.transition(.opacity)`.", "`.animation(_, value:)` animates only when `value` changes, which stops it from animating things you did not mean to.", "Keep motion short and quiet. Very long or bouncy animations get in the way. Many people turn on *Reduce Motion* in their phone settings, and a careful app respects it. You can read it from the environment with `accessibilityReduceMotion`."),
    N("Spring animations and many animation names have changed between iOS versions. If a name does not compile for your minimum iOS version, use `.easeInOut`, which works everywhere."),
    ...task("Replace the add sheet with `ExpenseFormView`.", "Show the error messages only after the first tap on Save, and clear them when the input is fixed.", "Add a `ExpandableNote`-style details area in the detail screen that opens with an animation.", "Turn on Reduce Motion in the Simulator's Accessibility settings and see how your app behaves."),
    ...check("An empty title or a zero amount shows an error and does not save.", "Choosing a category and a date saves them with the expense.", "The expandable area opens and closes smoothly."),
  ], A('Validate, then save', [
    n('form', 'Form', 'user types', 0, 0, 'user'), n('rules', 'Checks', 'title and amount', 1, 0, 'check'),
    n('err', 'Error text', 'next to the field', 1, 1, 'tool'), n('save', 'Saved', 'onSave then dismiss', 2, 0, 'out'),
  ], [
    { say: 'The user fills in the form: title, amount, category and date.', on: ['form'] },
    { say: 'When they tap Save, small computed properties check the input.', flow: ['form>rules:Save'] },
    { say: 'If something is wrong, a clear message appears next to that field and nothing is saved.', flow: ['rules>err:invalid'] },
    { say: 'If everything is fine, the expense is saved and the sheet closes.', flow: ['rules>save:valid'] },
  ]), [
    faq('What is the difference between withAnimation and the animation modifier?', 'withAnimation wraps a state change and animates everything affected by it. The animation(_:value:) modifier animates a view only when one particular value changes.'),
    faq('How do I validate a form in SwiftUI?', 'Write the rules as small computed properties, check them in a save function, show errors next to the fields, and repeat the checks where the data is stored.'),
    faq('Why use CaseIterable with a Picker?', 'CaseIterable gives allCases, a list of every enum case, so ForEach can build all the picker choices without you typing them again.'),
  ]),

  // ---------------------------------------------------------------- 10
  les(S4, 'swift-concurrency-async-await-task-and-actors', 'Swift Concurrency: async/await, Task, Actors and @MainActor', 'Swift Concurrency: async/await and Actors',
    'Learn why apps must not block the main thread, how async and await work, how to start work with Task and the task modifier, and what actors and @MainActor do.', [
    P("An iPhone app has one special thread, the **main thread**, which draws the screen and handles taps. If you do slow work on it, such as waiting for a web server, the app freezes and the user thinks it has crashed. Apps must do slow work *off to the side* and come back to the main thread when the result is ready. Swift has a modern, readable way to write this, called **Swift Concurrency**. You will use it for networking in lesson 11 and for saving data after that."),
    H("Before async/await"),
    P("In older code, slow work took a **completion handler**, a closure called later. Several in a row became a pyramid of nested braces that was hard to read and easy to get wrong. `async` and `await` let you write the same steps as ordinary code that reads from top to bottom."),
    H("async and await"),
    L("A function marked **`async`** may need to wait. While it waits, the thread is free to do other work.", "You call it with **`await`**. The word marks a *possible pause*. Your code stops at that line, and continues when the answer is ready. Meanwhile, the screen keeps working.", "A function that is `async throws` combines this with lesson 5. You call it with `try await`."),
    C('swift', S`struct ExpenseService {
    func loadExpenses() async throws -> [Expense] {
        // pretend to wait for a server
        try await Task.sleep(for: .seconds(1))
        return [
            Expense(title: "Coffee", amount: 3.5),
            Expense(title: "Train", amount: 12)
        ]
    }
}`),
    P("`Task.sleep` is a stand-in for a real wait. In lesson 11 it becomes a real network call. The shape of the code stays the same, so learning it now with a fake delay is useful."),
    H("Starting async work: the task modifier and Task"),
    P("You cannot call an `async` function from ordinary code, because ordinary code cannot pause. You start a new **task** instead. In SwiftUI the best way for work that belongs to a screen is the `.task` modifier. It starts when the view appears and is cancelled automatically when the view goes away."),
    C('swift', S`struct LoadingListView: View {
    @State private var expenses: [Expense] = []
    @State private var isLoading = false
    @State private var errorMessage: String?

    private let service = ExpenseService()

    var body: some View {
        List {
            if let errorMessage {
                Text(errorMessage).foregroundStyle(.red)
            }
            ForEach(expenses) { Text($0.title) }
        }
        .overlay {
            if isLoading { ProgressView() }
        }
        .task {
            isLoading = true
            do {
                expenses = try await service.loadExpenses()
            } catch {
                errorMessage = "Could not load. Please try again."
            }
            isLoading = false
        }
    }
}`),
    P("This is the pattern behind most screens in real apps: show a spinner, wait for the data, then show the result or a friendly error. Notice that the code reads in order, with no nested closures. When you want a task from a button tap or other ordinary code, use `Task { ... }`."),
    C('swift', S`Button("Refresh") {
    Task {
        isLoading = true
        expenses = (try? await service.loadExpenses()) ?? []
        isLoading = false
    }
}`),
    H("Doing several things at once"),
    P("If two calls do not depend on each other, start them together with `async let`, then `await` both. The total time is about the time of the slowest one, not the sum."),
    C('swift', S`func loadDashboard() async throws -> (expenses: [Expense], budget: Double) {
    async let list = service.loadExpenses()
    async let budget = fetchBudget()
    return try await (list, budget)
}`),
    P("For a variable number of calls, such as one per item in an array, Swift has **task groups**. They are an advanced topic. It is enough now to know that they exist."),
    H("Actors and the main actor"),
    P("When many tasks run at once and touch the same data, two of them can change it at the same moment and corrupt it. This is a **data race**. Swift's answer is the **actor**. An actor is like a class that handles one request at a time, so its data is safe. You call into an actor with `await`, because you may have to wait your turn."),
    C('swift', S`actor ExpenseCache {
    private var items: [UUID: Expense] = [:]

    func store(_ expense: Expense) { items[expense.id] = expense }
    func find(_ id: UUID) -> Expense? { items[id] }
}

let cache = ExpenseCache()
await cache.store(Expense(title: "Tea", amount: 2))`),
    P("The **main actor**, written `@MainActor`, is a special actor that stands for the main thread. Code that changes the screen has to run there. Views and anything they own are on the main actor already. When you write your own class that drives a screen, as in lesson 13, mark it `@MainActor` so the compiler checks this for you."),
    N("Swift 6 added stricter checks for data races, and newer Xcode versions can turn them on or run the main actor by default in new projects. You may see warnings that mention `Sendable`, which marks types that are safe to pass between tasks. Plain structs of simple values are usually fine. Read the message, and fix the one thing it names. Settings differ between Xcode versions, so check Apple's current notes if your project shows many."),
    H("Common mistakes"),
    L("Doing slow work without `async`, which freezes the screen.", "Changing the screen from the wrong thread. Mark view-driving classes `@MainActor`.", "Starting a `Task` in `onAppear` that never stops. Prefer `.task`, which cancels itself.", "Forgetting that after an `await`, other things may have changed. Do not assume the screen is as you left it."),
    ...task("Type the `ExpenseService` and `LoadingListView` and run them. Watch the spinner for one second and then the list.", "Make `loadExpenses` throw an error on purpose and check that your message shows.", "Add a Refresh button that uses `Task { ... }`.", "Write the `ExpenseCache` actor and call it from a `Task`. Notice why `await` is needed."),
    ...check("The list appears about a second after the screen opens, and the screen does not freeze meanwhile.", "When you force an error, the red message shows and the spinner stops.", "You can say what `await` marks and why an actor needs it."),
  ], A('Waiting without freezing', [
    n('ui', 'Main thread', 'draws the screen', 0, 0, 'app'), n('task', 'Task', 'starts the work', 1, 0, 'tool'),
    n('wait', 'await', 'a pause, not a freeze', 2, 0, 'check'), n('res', 'Result', 'back on the screen', 3, 0, 'out'),
  ], [
    { say: 'The main thread draws the screen and must never be blocked for long.', on: ['ui'] },
    { say: 'Slow work starts in a task, with the task modifier or Task.', flow: ['ui>task:start'] },
    { say: 'At an await, the task pauses and the main thread keeps the screen alive.', flow: ['task>wait:waits'] },
    { say: 'When the answer is ready, the code continues and the screen updates with the result.', flow: ['wait>res:continues'] },
  ]), [
    faq('What does await do in Swift?', 'It marks a point where the code may pause until an async function gives its answer. While it waits, the thread is free to do other work, so the screen does not freeze.'),
    faq('What is the difference between Task and the task modifier?', 'The task modifier starts when a view appears and is cancelled when it disappears, so it suits work that belongs to a screen. Task { } starts work from ordinary code such as a button tap.'),
    faq('What is an actor in Swift?', 'A type like a class that handles one request at a time, so its data cannot be changed by two tasks at once. You call into it with await.'),
  ]),
];
