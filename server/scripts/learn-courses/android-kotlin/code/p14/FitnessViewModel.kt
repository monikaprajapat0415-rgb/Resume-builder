package com.example.fitness

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import java.time.LocalDate
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class FitnessViewModel(
    private val sensor: StepSensor,
    private val dao: StepsDao,
) : ViewModel() {

    val sensorAvailable: Boolean get() = sensor.available
    val goal = 8000

    val week: StateFlow<List<DaySteps>> = dao.lastWeek()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private var tracking: Job? = null

    // Call after the user allowed activity recognition (Android 10 and newer).
    fun startTracking() {
        if (tracking != null || !sensor.available) return
        tracking = viewModelScope.launch {
            sensor.totals().collect { total ->
                val today = LocalDate.now().toString()
                val row = dao.forDay(today) ?: DaySteps(today, 0, total)
                // if the phone restarted, the total is lower than the saved baseline
                val baseline = if (total < row.baseline) 0f else row.baseline
                dao.save(row.copy(steps = (total - baseline).toInt(), baseline = baseline))
            }
        }
    }

    override fun onCleared() {
        tracking?.cancel()
    }
}

fun progress(steps: Int, goal: Int): Float {
    if (goal <= 0) return 0f
    return (steps.toFloat() / goal).coerceIn(0f, 1f)
}
