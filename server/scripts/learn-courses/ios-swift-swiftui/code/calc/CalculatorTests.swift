import Testing
@testable import PrimeCalc

struct CalculatorTests {
    @Test func multiplicationComesBeforeAddition() {
        #expect(Calculator.evaluate("2+3*4") == 14)
    }

    @Test func decimalsAndDivision() {
        #expect(Calculator.evaluate("7.5/2") == 3.75)
    }

    @Test func leadingMinus() {
        #expect(Calculator.evaluate("-5+2") == -3)
    }

    @Test func divisionByZeroIsInvalid() {
        #expect(Calculator.evaluate("5/0") == nil)
    }

    @Test func brokenInputIsInvalid() {
        #expect(Calculator.evaluate("2++3") == nil)
        #expect(Calculator.evaluate("abc") == nil)
        #expect(Calculator.evaluate("") == nil)
    }

    @Test func formatDropsTrailingZero() {
        #expect(Calculator.format(14) == "14")
        #expect(Calculator.format(3.75) == "3.75")
    }
}
