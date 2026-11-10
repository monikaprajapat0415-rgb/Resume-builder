import Observation

@Observable
final class CalculatorModel {
    var expression = ""
    var result = ""
    var hasError = false

    func press(_ key: String) {
        switch key {
        case "C":
            expression = ""
            result = ""
            hasError = false
        case "⌫":
            if !expression.isEmpty { expression.removeLast() }
        case "=":
            if let value = Calculator.evaluate(expression) {
                result = Calculator.format(value)
                expression = result
                hasError = false
            } else {
                result = "Invalid expression"
                hasError = true
            }
        default:
            hasError = false
            result = ""
            expression += key
        }
    }
}
