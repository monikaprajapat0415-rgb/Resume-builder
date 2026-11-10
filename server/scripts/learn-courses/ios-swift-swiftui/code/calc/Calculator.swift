import Foundation

enum Calculator {
    private enum Token {
        case number(Double)
        case op(Character)
    }

    // Cuts "12+3.5*2" into numbers and operators. A leading minus belongs to the first number.
    private static func tokens(_ text: String) -> [Token]? {
        var result: [Token] = []
        var current = ""
        for ch in text where ch != " " {
            if ch.isNumber || ch == "." {
                current.append(ch)
            } else if "+-*/".contains(ch) {
                if current.isEmpty {
                    if ch == "-" && result.isEmpty {
                        current = "-"
                        continue
                    }
                    return nil
                }
                guard let value = Double(current) else { return nil }
                result.append(.number(value))
                result.append(.op(ch))
                current = ""
            } else {
                return nil
            }
        }
        guard let last = Double(current) else { return nil }
        result.append(.number(last))
        return result
    }

    // Returns nil for anything that is not a valid sum, including division by zero.
    static func evaluate(_ text: String) -> Double? {
        guard let items = tokens(text), items.count % 2 == 1 else { return nil }
        guard case .number(let first) = items[0] else { return nil }

        // Pass 1: do * and / now, keep + and - for later.
        var numbers: [Double] = [first]
        var pending: [Character] = []
        var index = 1
        while index < items.count {
            guard case .op(let symbol) = items[index],
                  case .number(let value) = items[index + 1] else { return nil }
            switch symbol {
            case "*":
                numbers[numbers.count - 1] *= value
            case "/":
                if value == 0 { return nil }
                numbers[numbers.count - 1] /= value
            default:
                pending.append(symbol)
                numbers.append(value)
            }
            index += 2
        }

        // Pass 2: + and - from left to right.
        var total = numbers[0]
        for (position, symbol) in pending.enumerated() {
            let next = numbers[position + 1]
            total = symbol == "+" ? total + next : total - next
        }
        return total
    }

    // 14.0 prints as 14, 3.75 stays 3.75.
    static func format(_ value: Double) -> String {
        if value == value.rounded() && abs(value) < 1e15 {
            return String(Int(value))
        }
        return String(format: "%.6g", value)
    }
}
