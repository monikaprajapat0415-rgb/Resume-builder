package com.example.calculator

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class CalculatorTest {
    @Test
    fun multiplicationBeforeAddition() {
        assertEquals(14.0, Calculator.evaluate("2+3*4")!!, 0.0001)
    }

    @Test
    fun decimalsWork() {
        assertEquals(3.75, Calculator.evaluate("7.5/2")!!, 0.0001)
    }

    @Test
    fun leadingMinusIsAllowed() {
        assertEquals(-2.0, Calculator.evaluate("-5+3")!!, 0.0001)
    }

    @Test
    fun divisionByZeroIsInvalid() {
        assertNull(Calculator.evaluate("5/0"))
    }

    @Test
    fun brokenInputIsInvalid() {
        assertNull(Calculator.evaluate("5+"))
        assertNull(Calculator.evaluate("abc"))
    }
}
