package com.example.aichat

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun AiChatScreen(vm: AiChatViewModel) {
    val messages by vm.messages.collectAsState()
    val streaming by vm.streaming.collectAsState()
    val error by vm.error.collectAsState()
    var draft by remember { mutableStateOf("") }
    val list = rememberLazyListState()

    LaunchedEffect(messages.size, streaming) {
        val count = messages.size + if (streaming != null) 1 else 0
        if (count > 0) list.animateScrollToItem(count - 1)
    }

    Column(Modifier.fillMaxSize()) {
        Row(Modifier.fillMaxWidth().padding(8.dp), horizontalArrangement = Arrangement.SpaceBetween) {
            Column {
                Text("Assistant", style = MaterialTheme.typography.titleLarge)
                Text("AI answers can be wrong. Check important facts.", style = MaterialTheme.typography.bodySmall)
            }
            TextButton(onClick = vm::clear) { Text("Clear") }
        }
        LazyColumn(
            state = list,
            modifier = Modifier.weight(1f).padding(horizontal = 8.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            items(messages, key = { it.id }) { Bubble(it.text, mine = it.role == "user") }
            streaming?.let { item { Bubble(it + " ▌", mine = false) } }
        }
        error?.let { Text(it, color = MaterialTheme.colorScheme.error, modifier = Modifier.padding(horizontal = 12.dp)) }
        Row(Modifier.padding(8.dp), verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(
                value = draft,
                onValueChange = { draft = it },
                placeholder = { Text("Ask something") },
                modifier = Modifier.weight(1f),
            )
            if (streaming != null) {
                Button(onClick = vm::stop, modifier = Modifier.padding(start = 8.dp)) { Text("Stop") }
            } else {
                Button(
                    onClick = {
                        vm.send(draft)
                        draft = ""
                    },
                    modifier = Modifier.padding(start = 8.dp),
                ) { Text("Send") }
            }
        }
    }
}

@Composable
private fun Bubble(text: String, mine: Boolean) {
    Box(Modifier.fillMaxWidth(), contentAlignment = if (mine) Alignment.CenterEnd else Alignment.CenterStart) {
        Surface(
            shape = RoundedCornerShape(14.dp),
            color = if (mine) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant,
        ) {
            Text(text, Modifier.padding(12.dp))
        }
    }
}
