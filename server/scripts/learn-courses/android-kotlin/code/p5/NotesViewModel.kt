package com.example.notes

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class NotesViewModel(app: Application) : AndroidViewModel(app) {
    private val dao = AppDatabase.get(app).noteDao()

    private val _query = MutableStateFlow("")
    val query: StateFlow<String> = _query.asStateFlow()

    // Combine the database flow with the search text. The result is a new list every time either changes.
    val notes: StateFlow<List<Note>> = combine(dao.observeAll(), _query) { all, q ->
        if (q.isBlank()) all
        else all.filter { it.title.contains(q, ignoreCase = true) || it.body.contains(q, ignoreCase = true) }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    fun setQuery(text: String) { _query.value = text }

    fun save(id: Long, title: String, body: String) {
        if (title.isBlank() && body.isBlank()) return
        viewModelScope.launch {
            dao.save(Note(id = id, title = title.trim().ifEmpty { "Untitled" }, body = body.trim()))
        }
    }

    fun delete(note: Note) {
        viewModelScope.launch { dao.delete(note) }
    }
}
