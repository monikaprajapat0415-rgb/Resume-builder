package com.example.jobs

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp

@Composable
fun JobApp(vm: JobViewModel) {
    val s by vm.state.collectAsState()
    var selected by remember { mutableStateOf<Job?>(null) }
    val job = selected
    if (job == null) {
        JobList(vm, s, onOpen = { selected = it })
    } else {
        JobDetail(vm, s, job, onBack = {
            selected = null
            vm.messageShown()
        })
    }
}

@Composable
private fun JobList(vm: JobViewModel, s: JobsState, onOpen: (Job) -> Unit) {
    Column(Modifier.fillMaxSize().padding(12.dp)) {
        OutlinedTextField(
            value = s.filter.query,
            onValueChange = { vm.setFilter(s.filter.copy(query = it)) },
            label = { Text("Search title, company or city") },
            modifier = Modifier.fillMaxWidth(),
        )
        Row(Modifier.padding(vertical = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            FilterChip(
                selected = s.filter.remoteOnly,
                onClick = { vm.setFilter(s.filter.copy(remoteOnly = !s.filter.remoteOnly)) },
                label = { Text("Remote") },
            )
            listOf("Full-time", "Internship", "Contract").forEach { t ->
                FilterChip(
                    selected = s.filter.type == t,
                    onClick = { vm.setFilter(s.filter.copy(type = if (s.filter.type == t) null else t)) },
                    label = { Text(t) },
                )
            }
        }
        when {
            s.loading -> CircularProgressIndicator()
            s.error != null -> Column {
                Text(s.error, color = MaterialTheme.colorScheme.error)
                OutlinedButton(onClick = vm::load) { Text("Try again") }
            }
            s.shown.isEmpty() -> Text("No jobs match your filters.")
            else -> LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(s.shown, key = { it.id }) { j ->
                    Card(Modifier.fillMaxWidth().clickable { onOpen(j) }) {
                        Column(Modifier.padding(12.dp)) {
                            Text(j.title, style = MaterialTheme.typography.titleMedium)
                            Text(j.company + " · " + j.location + if (j.remote) " · Remote" else "")
                            Text(j.type, style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun JobDetail(vm: JobViewModel, s: JobsState, job: Job, onBack: () -> Unit) {
    val context = LocalContext.current
    var cover by remember { mutableStateOf("") }
    var resume by remember { mutableStateOf<Uri?>(null) }
    val picker = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { resume = it }

    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        OutlinedButton(onClick = onBack) { Text("Back") }
        Text(job.title, style = MaterialTheme.typography.headlineSmall)
        Text(job.company + " · " + job.location)
        Text(job.description)
        OutlinedTextField(cover, { cover = it }, label = { Text("Cover note (optional)") }, modifier = Modifier.fillMaxWidth())
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedButton(onClick = {
                picker.launch(arrayOf("application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
            }) { Text(if (resume == null) "Choose resume" else "Resume chosen") }
            Button(
                onClick = { resume?.let { vm.apply(context.contentResolver, job.id, cover, it) } },
                enabled = resume != null && !s.applying,
            ) { Text(if (s.applying) "Sending..." else "Apply") }
        }
        s.applyMessage?.let { Text(it) }
    }
}
