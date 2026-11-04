package com.example.video

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun VideoApp() {
    var selected by remember { mutableStateOf(Videos.all.first()) }
    var status by remember { mutableStateOf(PlayerStatus()) }

    Column(Modifier.fillMaxSize()) {
        VideoPlayer(selected.url) { status = it }
        if (status.buffering) {
            CircularProgressIndicator(Modifier.padding(8.dp))
        }
        status.error?.let { Text(it, color = MaterialTheme.colorScheme.error, modifier = Modifier.padding(12.dp)) }
        Text(selected.title, style = MaterialTheme.typography.titleLarge, modifier = Modifier.padding(12.dp))
        Text(selected.description, modifier = Modifier.padding(horizontal = 12.dp))

        Text("More videos", style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(12.dp))
        LazyColumn(
            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            items(Videos.all, key = { it.url }) { v ->
                Card(
                    Modifier.fillMaxWidth().clickable {
                        status = PlayerStatus()
                        selected = v
                    },
                ) {
                    Column(Modifier.padding(12.dp)) {
                        Text(v.title)
                        Text(v.description, style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }
    }
}
