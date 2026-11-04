package com.example.weather

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.io.IOException

// One sealed type lists every state the screen can be in. The UI cannot show a half-state by mistake.
sealed interface UiState {
    data object Idle : UiState
    data object Loading : UiState
    data class Success(val weather: Weather) : UiState
    data class Error(val message: String) : UiState
}

class WeatherViewModel(private val repo: WeatherRepository = WeatherRepository()) : ViewModel() {
    private val _state = MutableStateFlow<UiState>(UiState.Idle)
    val state: StateFlow<UiState> = _state.asStateFlow()

    fun search(city: String) {
        if (city.isBlank()) { _state.value = UiState.Error("Type a city name first"); return }
        _state.value = UiState.Loading
        viewModelScope.launch {
            _state.value = try {
                UiState.Success(repo.load(city))
            } catch (e: CityNotFound) {
                UiState.Error(e.message ?: "City not found")
            } catch (e: IOException) {
                UiState.Error("No connection. Check the internet and try again.")
            } catch (e: Exception) {
                UiState.Error("Something went wrong: ${e.message}")
            }
        }
    }
}
