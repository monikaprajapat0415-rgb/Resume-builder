package com.example.bank

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class BankTest {
    private val list = listOf(
        Transaction("1", "Salary", 500000, "2026-11-01"),
        Transaction("2", "Rent", -150000, "2026-11-02"),
    )

    @Test
    fun balanceAddsAmounts() {
        assertEquals(350000L, BankRules.balance(list))
    }

    @Test
    fun cannotSendMoreThanBalance() {
        assertTrue(BankRules.canTransfer(350000, 100))
        assertFalse(BankRules.canTransfer(350000, 400000))
        assertFalse(BankRules.canTransfer(350000, 0))
    }

    @Test
    fun accountIsMasked() {
        assertEquals("••••5678", BankRules.mask("12345678"))
    }

    @Test
    fun negativeMoneyFormat() {
        assertEquals("-1500.00", (-150000L).asMoney())
    }
}
