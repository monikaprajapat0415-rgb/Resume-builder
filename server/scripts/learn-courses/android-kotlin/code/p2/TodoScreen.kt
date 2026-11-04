package com.example.todo

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun TodoScreen(vm: TodoViewModel = viewModel()) {
    val tasks by vm.tasks.collectAsStateWithLifecycle()
    var draft by remember { mutableStateOf("") }

    Column(Modifier.fillMaxSize().systemBarsPadding().padding(16.dp)) {
        Text("To-Do", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(12.dp))

        Row(verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(
                value = draft,
                onValueChange = { draft = it },
                label = { Text("New task") },
                singleLine = true,
                modifier = Modifier.weight(1f)
            )
            Spacer(Modifier.width(8.dp))
            FilledIconButton(onClick = { vm.add(draft); draft = "" }) {
                Icon(Icons.Default.Add, contentDescription = "Add task")
            }
        }

        Spacer(Modifier.height(12.dp))
        val left = tasks.count { !it.done }
        Text("$left left, ${tasks.size - left} done", style = MaterialTheme.typography.bodyMedium)

        if (tasks.isEmpty()) {
            Box(Modifier.fillMaxWidth().weight(1f), contentAlignment = Alignment.Center) {
                Text("Nothing to do. Add your first task above.")
            }
        } else {
            LazyColumn(Modifier.weight(1f)) {
                items(tasks, key = { it.id }) { task ->
                    TaskRow(task, onToggle = { vm.toggle(task.id) }, onDelete = { vm.remove(task.id) })
                }
            }
        }
        TextButton(onClick = vm::clearDone, enabled = tasks.any { it.done }) { Text("Clear finished tasks") }
    }
}

@Composable
private fun TaskRow(task: Task, onToggle: () -> Unit, onDelete: () -> Unit) {
    Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Checkbox(checked = task.done, onCheckedChange = { onToggle() })
        Text(
            task.title,
            modifier = Modifier.weight(1f),
            textDecoration = if (task.done) TextDecoration.LineThrough else TextDecoration.None
        )
        IconButton(onClick = onDelete) { Icon(Icons.Default.Delete, contentDescription = "Delete ${task.title}") }
    }
}
