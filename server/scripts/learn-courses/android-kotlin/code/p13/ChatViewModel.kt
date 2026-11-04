package com.example.chat

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class AuthState(
    val signedIn: Boolean = false,
    val busy: Boolean = false,
    val error: String? = null,
)

class ChatViewModel(private val repo: ChatRepository = ChatRepository()) : ViewModel() {

    private val _auth = MutableStateFlow(AuthState(signedIn = repo.currentUid != null))
    val auth: StateFlow<AuthState> = _auth.asStateFlow()

    val myUid: String? get() = repo.currentUid

    val messages: StateFlow<List<Message>> = repo.messages("general")
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun signIn(email: String, password: String, create: Boolean) {
        if (!email.contains("@") || password.length < 6) {
            _auth.value = AuthState(error = "Enter a valid email and a password of 6 or more characters")
            return
        }
        _auth.value = AuthState(busy = true)
        viewModelScope.launch {
            val result = if (create) repo.register(email.trim(), password) else repo.signIn(email.trim(), password)
            _auth.value = result.fold(
                onSuccess = { AuthState(signedIn = true) },
                onFailure = { AuthState(error = it.message ?: "Sign in failed") },
            )
        }
    }

    fun send(text: String) {
        val clean = text.trim()
        if (clean.isEmpty()) return
        viewModelScope.launch { repo.send("general", clean) }
    }

    fun signOut() {
        repo.signOut()
        _auth.value = AuthState()
    }
}
