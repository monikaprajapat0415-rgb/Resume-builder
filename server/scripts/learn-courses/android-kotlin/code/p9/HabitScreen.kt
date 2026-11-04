package com.example.habits

import android.Manifest
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun HabitScreen(vm: HabitViewModel = viewModel()) {
    val today by vm.today.collectAsStateWithLifecycle()
    val context = LocalContext.current
    var name by remember { mutableStateOf("") }

    // Ask for the notification permission once, then start the daily reminder either way.
    val permission = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { /* the worker checks it again */ }
    LaunchedEffect(Unit) {
        if (Build.VERSION.SDK_INT >= 33) permission.launch(Manifest.permission.POST_NOTIFICATIONS)
        ReminderWorker.schedule(context)
    }

    Column(Modifier.fillMaxSize().systemBarsPadding().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Text("Habits", style = MaterialTheme.typography.headlineMedium)
        Text("${today.doneIds.size} of ${today.habits.size} done today")
        Row(verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(name, { name = it }, label = { Text("New habit, e.g. Walk 20 minutes") }, singleLine = true, modifier = Modifier.weight(1f))
            Spacer(Modifier.width(8.dp))
            Button(onClick = { vm.add(name); name = "" }) { Text("Add") }
        }
        if (today.habits.isEmpty()) Text("No habits yet. Add one small habit to begin.")
        LazyColumn(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            items(today.habits, key = { it.id }) { habit ->
                val done = habit.id in today.doneIds
                Card(Modifier.fillMaxWidth()) {
                    Row(Modifier.padding(8.dp), verticalAlignment = Alignment.CenterVertically) {
                        Checkbox(checked = done, onCheckedChange = { vm.toggle(habit.id) })
                        Column(Modifier.weight(1f)) {
                            Text(habit.name, style = MaterialTheme.typography.titleMedium)
                            Text("Streak: ${today.streaks[habit.id] ?: 0} days", style = MaterialTheme.typography.bodySmall)
                        }
                        IconButton(onClick = { vm.remove(habit.id) }) { Icon(Icons.Default.Delete, "Delete ${habit.name}") }
                    }
                }
            }
        }
    }
}
