package com.example.fitness

import android.Manifest
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.unit.dp

@Composable
fun FitnessScreen(vm: FitnessViewModel) {
    val week by vm.week.collectAsState()
    val today = week.firstOrNull()?.steps ?: 0

    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        if (granted) vm.startTracking()
    }

    // The permission is only needed from Android 10; older versions start at once.
    LaunchedEffect(Unit) {
        if (android.os.Build.VERSION.SDK_INT >= 29) {
            launcher.launch(Manifest.permission.ACTIVITY_RECOGNITION)
        } else {
            vm.startTracking()
        }
    }

    Column(
        Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Steps today", style = MaterialTheme.typography.titleMedium)
        Text(today.toString(), style = MaterialTheme.typography.displayMedium)
        LinearProgressIndicator(progress = { progress(today, vm.goal) }, modifier = Modifier.fillMaxWidth())
        Text("Goal: " + vm.goal + " steps")

        if (!vm.sensorAvailable) {
            Text("This phone has no step counter sensor.", color = MaterialTheme.colorScheme.error)
        }

        Text("Last 7 days", style = MaterialTheme.typography.titleMedium)
        BarChart(week.reversed().map { it.steps }, vm.goal)
        Button(onClick = { launcher.launch(Manifest.permission.ACTIVITY_RECOGNITION) }) {
            Text("Allow step counting")
        }
    }
}

@Composable
fun BarChart(values: List<Int>, goal: Int) {
    val barColor = MaterialTheme.colorScheme.primary
    val lineColor = MaterialTheme.colorScheme.tertiary
    Canvas(
        Modifier
            .fillMaxWidth()
            .height(160.dp),
    ) {
        if (values.isEmpty()) return@Canvas
        val maxValue = maxOf(values.max(), goal).coerceAtLeast(1).toFloat()
        val slot = size.width / values.size
        val barWidth = slot * 0.6f
        values.forEachIndexed { index, v ->
            val h = size.height * (v / maxValue)
            drawRect(
                color = barColor,
                topLeft = Offset(index * slot + (slot - barWidth) / 2, size.height - h),
                size = Size(barWidth, h),
            )
        }
        val goalY = size.height * (1 - goal / maxValue)
        drawLine(lineColor, Offset(0f, goalY), Offset(size.width, goalY), strokeWidth = 3f)
    }
}
