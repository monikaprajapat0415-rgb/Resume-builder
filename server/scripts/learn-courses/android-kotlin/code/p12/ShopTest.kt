package com.example.shop

import org.junit.Assert.assertEquals
import org.junit.Test

class ShopTest {
    @Test
    fun centsFormatWithTwoDigits() {
        assertEquals("19.70", 1970L.asMoney())
        assertEquals("0.05", 5L.asMoney())
        assertEquals("100.00", 10000L.asMoney())
    }
}
