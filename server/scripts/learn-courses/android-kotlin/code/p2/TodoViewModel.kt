package com.example.todo

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

class TodoViewModel : ViewModel() {
    private val _tasks = MutableStateFlow<List<Task>>(emptyList())
    val tasks: StateFlow<List<Task>> = _tasks.asStateFlow()

    private var nextId = 1L

    fun add(title: String) {
        val clean = title.trim()
        if (clean.isEmpty()) return
        _tasks.update { it + Task(id = nextId++, title = clean) }
    }

    fun toggle(id: Long) {
        _tasks.update { list -> list.map { if (it.id == id) it.copy(done = !it.done) else it } }
    }

    fun remove(id: Long) {
        _tasks.update { list -> list.filterNot { it.id == id } }
    }

    fun clearDone() {
        _tasks.update { list -> list.filterNot { it.done } }
    }
}
