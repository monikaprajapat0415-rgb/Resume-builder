package com.example.tipcalc

import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Test

class TipMathTest {
    @Test
    fun tenPercentOfOneHundred() {
        val r = calculateTip(bill = 100.0, tipPercent = 10, people = 1, roundUp = false)
        assertEquals(10.0, r.tip, 0.001)
        assertEquals(110.0, r.total, 0.001)
    }

    @Test
    fun splitBetweenPeople() {
        val r = calculateTip(bill = 90.0, tipPercent = 0, people = 3, roundUp = false)
        assertEquals(30.0, r.perPerson, 0.001)
    }

    @Test
    fun roundUpRaisesTheTip() {
        val r = calculateTip(bill = 33.0, tipPercent = 15, people = 1, roundUp = true)   // 4.95 becomes 5.0
        assertEquals(5.0, r.tip, 0.001)
    }

    @Test
    fun zeroPeopleIsRejected() {
        assertThrows(IllegalArgumentException::class.java) { calculateTip(10.0, 10, 0, false) }
    }
}
