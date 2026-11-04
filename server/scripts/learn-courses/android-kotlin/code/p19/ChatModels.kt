package com.example.aichat

import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

@Entity(tableName = "chat_message")
data class StoredMessage(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val role: String,          // "user" or "assistant"
    val text: String,
    val time: Long = System.currentTimeMillis(),
)

// What your server expects. The server holds the AI key, so the app never has it.
@Serializable
data class WireMessage(val role: String, val text: String)

@Serializable
data class ChatRequest(val messages: List<WireMessage>)

// Only the most recent messages are sent, to limit cost and keep requests small.
fun recentHistory(all: List<StoredMessage>, max: Int = 12): List<WireMessage> {
    return all.takeLast(max).map { WireMessage(it.role, it.text) }
}
