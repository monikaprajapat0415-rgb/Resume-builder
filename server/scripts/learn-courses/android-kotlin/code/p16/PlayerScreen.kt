package com.example.music

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Slider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun PlayerScreen(vm: PlayerViewModel = viewModel()) {
    val ui by vm.ui.collectAsState()

    Column(
        Modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(ui.title.ifEmpty { "Loading..." }, style = MaterialTheme.typography.headlineSmall)
        Text(ui.artist)

        Slider(
            value = ui.positionMs.toFloat(),
            onValueChange = { vm.seekTo(it.toLong()) },
            valueRange = 0f..ui.durationMs.coerceAtLeast(1).toFloat(),
            modifier = Modifier.fillMaxWidth().padding(top = 24.dp),
        )
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(formatTime(ui.positionMs))
            Text(formatTime(ui.durationMs))
        }
        Row(
            Modifier.padding(top = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            OutlinedButton(onClick = vm::previous) { Text("Prev") }
            Button(onClick = vm::toggle, enabled = ui.connected) { Text(if (ui.playing) "Pause" else "Play") }
            OutlinedButton(onClick = vm::next) { Text("Next") }
        }
    }
}
