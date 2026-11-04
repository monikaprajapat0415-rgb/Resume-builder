package com.example.aichat

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.room.Room

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val db = Room.databaseBuilder(applicationContext, ChatDatabase::class.java, "aichat.db").build()
        // Start with the fake service. To use a real model, call your own server:
        // ServerAiService(OkHttpClient(), "https://your-server.example.com/chat")
        val ai: AiService = FakeAiService()

        setContent {
            MaterialTheme {
                Surface(Modifier.systemBarsPadding()) {
                    val vm: AiChatViewModel = viewModel(
                        factory = object : ViewModelProvider.Factory {
                            @Suppress("UNCHECKED_CAST")
                            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                                return AiChatViewModel(db.messages(), ai) as T
                            }
                        },
                    )
                    AiChatScreen(vm)
                }
            }
        }
    }
}
