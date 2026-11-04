package com.example.habits

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class HabitViewModel(app: Application) : AndroidViewModel(app) {
    private val store = HabitStore(app)

    val today: StateFlow<HabitsToday> = store.today.stateIn(
        viewModelScope, SharingStarted.WhileSubscribed(5_000), HabitsToday(emptyList(), emptySet(), emptyMap())
    )

    fun add(name: String) { if (name.isNotBlank()) viewModelScope.launch { store.add(name) } }
    fun toggle(id: Long) { viewModelScope.launch { store.toggleToday(id) } }
    fun remove(id: Long) { viewModelScope.launch { store.remove(id) } }
}
