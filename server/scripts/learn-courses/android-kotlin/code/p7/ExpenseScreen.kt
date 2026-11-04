package com.example.expenses

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import java.text.DateFormat
import java.util.Date

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExpenseScreen(vm: ExpenseViewModel = viewModel()) {
    val expenses by vm.expenses.collectAsStateWithLifecycle()
    val totals by vm.totals.collectAsStateWithLifecycle()
    val grand by vm.grandTotal.collectAsStateWithLifecycle()
    var showAdd by remember { mutableStateOf(false) }

    Scaffold(
        topBar = { TopAppBar(title = { Text("Expenses") }) },
        floatingActionButton = {
            FloatingActionButton(onClick = { showAdd = true }) { Icon(Icons.Default.Add, "Add expense") }
        }
    ) { padding ->
        LazyColumn(Modifier.padding(padding).padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            item {
                Card(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp)) {
                        Text("Total spent", style = MaterialTheme.typography.labelLarge)
                        Text(grand.asMoney(), style = MaterialTheme.typography.displaySmall)
                    }
                }
            }
            if (totals.isNotEmpty()) {
                item { Text("By category", style = MaterialTheme.typography.titleMedium) }
                items(totals, key = { it.category }) { t ->
                    Column {
                        Row { Text(t.category, Modifier.weight(1f)); Text(t.total.asMoney()) }
                        LinearProgressIndicator(
                            progress = { if (grand == 0L) 0f else t.total.toFloat() / grand },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }
            item { Text("History", style = MaterialTheme.typography.titleMedium) }
            if (expenses.isEmpty()) item { Text("No expenses yet. Tap + to add one.") }
            items(expenses, key = { it.id }) { e ->
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text(e.title, style = MaterialTheme.typography.bodyLarge)
                        Text("${e.category} · ${DateFormat.getDateInstance().format(Date(e.dateMillis))}",
                            style = MaterialTheme.typography.bodySmall)
                    }
                    Text(e.amountCents.asMoney())
                    IconButton(onClick = { vm.delete(e) }) { Icon(Icons.Default.Delete, "Delete ${e.title}") }
                }
            }
        }
    }

    if (showAdd) AddDialog(onDismiss = { showAdd = false }, onSave = { t, a, c -> vm.add(t, a, c) })
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun AddDialog(onDismiss: () -> Unit, onSave: (String, String, String) -> String?) {
    var title by remember { mutableStateOf("") }
    var amount by remember { mutableStateOf("") }
    var category by remember { mutableStateOf(categoryNames.first()) }
    var error by remember { mutableStateOf<String?>(null) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Add expense") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(title, { title = it }, label = { Text("What was it?") }, singleLine = true)
                OutlinedTextField(amount, { amount = it }, label = { Text("Amount") }, singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal))
                Text("Category")
                FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    categoryNames.forEach { name ->
                        FilterChip(selected = category == name, onClick = { category = name }, label = { Text(name) })
                    }
                }
                error?.let { Text(it, color = MaterialTheme.colorScheme.error) }
            }
        },
        confirmButton = {
            TextButton(onClick = {
                error = onSave(title, amount, category)
                if (error == null) onDismiss()
            }) { Text("Save") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } }
    )
}
