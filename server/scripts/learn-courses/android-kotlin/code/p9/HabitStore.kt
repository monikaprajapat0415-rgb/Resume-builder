package com.example.habits

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.time.LocalDate

// One DataStore for the whole app. Small settings and lists belong here; big or relational data belongs in Room.
private val Context.dataStore by preferencesDataStore(name = "habits")

@Serializable
data class Habit(val id: Long, val name: String)

@Serializable
private data class Saved(val habits: List<Habit> = emptyList(), val done: Set<String> = emptySet())

/** Everything the screen needs: the habits, and which ones are ticked today. */
data class HabitsToday(val habits: List<Habit>, val doneIds: Set<Long>, val streaks: Map<Long, Int>)

class HabitStore(private val context: Context) {
    private val key = stringPreferencesKey("data")
    private val json = Json { ignoreUnknownKeys = true }

    private fun decode(raw: String?): Saved = raw?.let { runCatching { json.decodeFromString<Saved>(it) }.getOrNull() } ?: Saved()
    private suspend fun update(change: (Saved) -> Saved) {
        context.dataStore.edit { prefs -> prefs[key] = json.encodeToString(change(decode(prefs[key]))) }
    }

    // "2025-03-14#7" means habit 7 was done on 14 March 2025.
    private fun mark(date: LocalDate, id: Long) = "$date#$id"

    val today: Flow<HabitsToday> = context.dataStore.data.map { prefs ->
        val saved = decode(prefs[key])
        val today = LocalDate.now()
        HabitsToday(
            habits = saved.habits,
            doneIds = saved.habits.map { it.id }.filter { mark(today, it) in saved.done }.toSet(),
            streaks = saved.habits.associate { it.id to streak(saved.done, it.id, today) }
        )
    }

    suspend fun add(name: String) = update { it.copy(habits = it.habits + Habit(System.currentTimeMillis(), name.trim())) }

    suspend fun remove(id: Long) = update { s ->
        s.copy(habits = s.habits.filterNot { it.id == id }, done = s.done.filterNot { it.endsWith("#$id") }.toSet())
    }

    suspend fun toggleToday(id: Long) = update { s ->
        val m = mark(LocalDate.now(), id)
        s.copy(done = if (m in s.done) s.done - m else s.done + m)
    }

    /** Days in a row ending today (or yesterday, if today is not ticked yet). */
    private fun streak(done: Set<String>, id: Long, today: LocalDate): Int {
        var day = if (mark(today, id) in done) today else today.minusDays(1)
        var count = 0
        while (mark(day, id) in done) { count++; day = day.minusDays(1) }
        return count
    }
}
