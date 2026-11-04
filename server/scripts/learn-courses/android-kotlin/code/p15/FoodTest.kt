package com.example.food

import org.junit.Assert.assertEquals
import org.junit.Test

class FoodTest {
    @Test
    fun totalAddsDishPricesTimesQuantity() {
        val state = FoodState(cart = mapOf(1 to 2, 3 to 1))
        assertEquals(24900L * 2 + 29900L, state.totalCents())
    }

    @Test
    fun courierMovesHalfWay() {
        val p = courierPosition(Pair(0.0, 0.0), Pair(2.0, 4.0), 0.5f)
        assertEquals(1.0, p.first, 0.0001)
        assertEquals(2.0, p.second, 0.0001)
    }

    @Test
    fun rupeeFormat() {
        assertEquals("₹249.00", 24900L.rupees())
    }
}
