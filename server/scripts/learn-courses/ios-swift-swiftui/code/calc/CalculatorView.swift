import SwiftUI

struct CalculatorView: View {
    @State private var model = CalculatorModel()

    private let rows: [[String]] = [
        ["7", "8", "9", "/"],
        ["4", "5", "6", "*"],
        ["1", "2", "3", "-"],
        [".", "0", "=", "+"],
        ["C", "⌫"]
    ]

    var body: some View {
        VStack(spacing: 12) {
            Spacer()
            Text(model.expression.isEmpty ? "0" : model.expression)
                .font(.system(size: 44, weight: .light))
                .lineLimit(1)
                .minimumScaleFactor(0.4)
                .frame(maxWidth: .infinity, alignment: .trailing)
            Text(model.result)
                .font(.title3)
                .foregroundStyle(model.hasError ? Color.red : Color.secondary)
                .frame(maxWidth: .infinity, alignment: .trailing)
                .frame(height: 28)

            ForEach(rows, id: \.self) { row in
                HStack(spacing: 12) {
                    ForEach(row, id: \.self) { key in
                        Button {
                            model.press(key)
                        } label: {
                            Text(key)
                                .font(.title)
                                .frame(maxWidth: .infinity, minHeight: 64)
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(color(for: key))
                    }
                }
            }
        }
        .padding()
    }

    private func color(for key: String) -> Color {
        if "+-*/=".contains(key) { return .orange }
        if key == "C" || key == "⌫" { return .gray }
        return .blue
    }
}

#Preview {
    CalculatorView()
}
