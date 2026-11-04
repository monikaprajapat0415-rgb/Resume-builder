package com.example.aichat

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class AiChatViewModel(
    private val dao: MessageDao,
    private val ai: AiService,
) : ViewModel() {

    val messages: StateFlow<List<StoredMessage>> = dao.all()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // text of the reply being written right now, shown below the stored messages
    private val _streaming = MutableStateFlow<String?>(null)
    val streaming: StateFlow<String?> = _streaming.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    private var job: Job? = null

    fun send(text: String) {
        val clean = text.trim().take(2000)
        if (clean.isEmpty() || job?.isActive == true) return
        _error.value = null
        job = viewModelScope.launch {
            dao.insert(StoredMessage(role = "user", text = clean))
            val history = recentHistory(dao.all().first())
            var last = ""
            try {
                ai.reply(history).flowOn(Dispatchers.IO).collect {
                    last = it
                    _streaming.value = it
                }
                if (last.isNotEmpty()) dao.insert(StoredMessage(role = "assistant", text = last))
            } catch (e: CancellationException) {
                // the user pressed Stop: keep what was written so far
                if (last.isNotEmpty()) dao.insert(StoredMessage(role = "assistant", text = last))
                throw e
            } catch (e: Exception) {
                _error.value = "Could not get a reply. Try again."
            } finally {
                _streaming.value = null
            }
        }
    }

    fun stop() {
        job?.cancel()
    }

    fun clear() {
        viewModelScope.launch { dao.clear() }
    }
}
