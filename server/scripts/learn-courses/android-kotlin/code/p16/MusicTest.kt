package com.example.music

import org.junit.Assert.assertEquals
import org.junit.Test

class MusicTest {
    @Test
    fun timeFormat() {
        assertEquals("0:00", formatTime(0))
        assertEquals("1:05", formatTime(65_000))
        assertEquals("10:00", formatTime(600_000))
        assertEquals("0:00", formatTime(-5))
    }
}
