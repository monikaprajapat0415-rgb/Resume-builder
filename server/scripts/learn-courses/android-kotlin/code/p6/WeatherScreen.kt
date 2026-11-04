package com.example.weather

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun WeatherScreen(vm: WeatherViewModel = viewModel()) {
    val state by vm.state.collectAsStateWithLifecycle()
    var city by remember { mutableStateOf("") }

    Column(Modifier.fillMaxSize().systemBarsPadding().padding(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        Text("Weather", style = MaterialTheme.typography.headlineMedium)
        Row(verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(city, { city = it }, label = { Text("City") }, singleLine = true, modifier = Modifier.weight(1f))
            Spacer(Modifier.width(8.dp))
            Button(onClick = { vm.search(city) }) { Text("Search") }
        }

        when (val s = state) {
            UiState.Idle -> Text("Search for a city to see its weather.")
            UiState.Loading -> CircularProgressIndicator()
            is UiState.Error -> Text(s.message, color = MaterialTheme.colorScheme.error)
            is UiState.Success -> {
                val w = s.weather
                Card(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp)) {
                        Text(w.place, style = MaterialTheme.typography.titleLarge)
                        Text("${w.current.temperature}°C", style = MaterialTheme.typography.displayMedium)
                        Text(describe(w.current.weatherCode))
                        Text("Wind ${w.current.windSpeed} km/h")
                    }
                }
                Text("Next days", style = MaterialTheme.typography.titleMedium)
                w.daily.time.forEachIndexed { i, day ->
                    Text("$day:  ${w.daily.min[i]}° to ${w.daily.max[i]}°")
                }
            }
        }
    }
}
