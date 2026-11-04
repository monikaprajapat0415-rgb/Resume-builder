package com.example.aichat

import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody

// One interface, two implementations. The screen does not care which one it gets.
interface AiService {
    // Emits the reply as it grows: "Hel", "Hello", "Hello the"...
    fun reply(history: List<WireMessage>): Flow<String>
}

// Works with no server and no key, so you can build and test the whole screen first.
class FakeAiService : AiService {
    override fun reply(history: List<WireMessage>): Flow<String> = flow {
        val question = history.lastOrNull { it.role == "user" }?.text.orEmpty()
        val answer = "This is a demo answer to: " + question + ". Connect the app to your own server to get real AI replies."
        var shown = ""
        for (word in answer.split(" ")) {
            shown = if (shown.isEmpty()) word else shown + " " + word
            emit(shown)
            delay(80)
        }
    }
}

// Calls YOUR server. The server checks the user, holds the AI key, calls the model and
// streams plain text chunks back. Replace the URL with your own.
class ServerAiService(
    private val client: OkHttpClient,
    private val url: String,
) : AiService {
    private val json = Json

    override fun reply(history: List<WireMessage>): Flow<String> = flow {
        val body = json.encodeToString(ChatRequest.serializer(), ChatRequest(history))
            .toRequestBody("application/json".toMediaType())
        val request = Request.Builder().url(url).post(body).build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw java.io.IOException("Server error " + response.code)
            val source = response.body?.source() ?: throw java.io.IOException("Empty reply")
            var text = ""
            while (!source.exhausted()) {
                val chunk = source.readUtf8Line() ?: break
                text += chunk
                emit(text)
            }
        }
    }
}
