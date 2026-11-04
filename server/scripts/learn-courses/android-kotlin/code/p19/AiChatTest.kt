package com.example.aichat

import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class AiChatTest {
    @Test
    fun historyKeepsOnlyRecentMessages() {
        val all = (1..30).map { StoredMessage(it.toLong(), "user", "m" + it) }
        val recent = recentHistory(all, max = 5)
        assertEquals(5, recent.size)
        assertEquals("m30", recent.last().text)
    }

    @Test
    fun fakeReplyGrowsWordByWord() = runTest {
        val chunks = FakeAiService().reply(listOf(WireMessage("user", "Hi"))).toList()
        assertTrue(chunks.size > 3)
        assertTrue(chunks.last().startsWith(chunks.first()))
    }
}
