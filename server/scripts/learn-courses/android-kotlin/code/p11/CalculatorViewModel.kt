package com.example.calculator

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class CalcState(
    val expression: String = "",
    val result: String = "",
    val error: Boolean = false,
)

class CalculatorViewModel : ViewModel() {
    private val _state = MutableStateFlow(CalcState())
    val state: StateFlow<CalcState> = _state.asStateFlow()

    fun onKey(key: String) {
        when (key) {
            "C" -> _state.value = CalcState()
            "⌫" -> _state.update { it.copy(expression = it.expression.dropLast(1), error = false) }
            "=" -> equals()
            else -> _state.update { it.copy(expression = it.expression + key, error = false) }
        }
    }

    private fun equals() {
        val current = _state.value.expression
        val value = Calculator.evaluate(current)
        if (value == null) {
            _state.update { it.copy(error = true) }
        } else {
            val text = Calculator.format(value)
            _state.value = CalcState(expression = text, result = text)
        }
    }
}
