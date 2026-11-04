package com.example.video

import org.junit.Assert.assertEquals
import org.junit.Test

class VideoTest {
    @Test
    fun durationFormat() {
        assertEquals("0:09", formatDuration(9_000))
        assertEquals("2:05", formatDuration(125_000))
        assertEquals("1:01:01", formatDuration(3_661_000))
        assertEquals("--:--", formatDuration(-1))
    }
}
