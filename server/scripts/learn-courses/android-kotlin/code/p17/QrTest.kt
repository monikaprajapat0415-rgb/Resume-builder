package com.example.qr

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class QrTest {
    @Test
    fun linksAreRecognised() {
        val k = classify("https://example.com/a")
        assertTrue(k is ScanKind.Link)
    }

    @Test
    fun wifiNameIsRead() {
        val k = classify("WIFI:T:WPA;S:HomeNet;P:secret;;") as ScanKind.Wifi
        assertEquals("HomeNet", k.ssid)
    }

    @Test
    fun otherTextIsText() {
        assertEquals(ScanKind.Text("hello"), classify("  hello "))
    }
}
