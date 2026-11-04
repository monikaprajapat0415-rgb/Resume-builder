package com.example.converter

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import java.util.Locale

@Composable
fun ConverterScreen() {
    var categoryIndex by remember { mutableIntStateOf(0) }
    var fromIndex by remember { mutableIntStateOf(0) }
    var toIndex by remember { mutableIntStateOf(1) }
    var input by remember { mutableStateOf("1") }

    val category = categories[categoryIndex]
    val from = category.units[fromIndex]
    val to = category.units[toIndex]

    val number = input.toDoubleOrNull()
    // derivedStateOf would also work here; a plain value is fine because it is cheap.
    val output = number?.let { convert(it, from, to) }

    Column(
        Modifier.fillMaxSize().systemBarsPadding().padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Text("Unit Converter", style = MaterialTheme.typography.headlineMedium)

        Picker(label = "Category", options = categories.map { it.name }, selected = categoryIndex) {
            categoryIndex = it; fromIndex = 0; toIndex = 1   // reset units when the category changes
        }
        OutlinedTextField(
            value = input,
            onValueChange = { input = it },
            label = { Text("Value") },
            isError = number == null && input.isNotEmpty(),
            supportingText = { if (number == null && input.isNotEmpty()) Text("Enter a number") },
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
            modifier = Modifier.fillMaxWidth()
        )
        Picker("From", category.units.map { it.name }, fromIndex) { fromIndex = it }
        Picker("To", category.units.map { it.name }, toIndex) { toIndex = it }

        OutlinedButton(onClick = { val t = fromIndex; fromIndex = toIndex; toIndex = t }) { Text("Swap units") }

        Card(Modifier.fillMaxWidth()) {
            Text(
                text = if (output == null) "-" else "${format(number!!)} ${from.name} = ${format(output)} ${to.name}",
                style = MaterialTheme.typography.titleMedium,
                modifier = Modifier.padding(16.dp)
            )
        }
    }
}

@Composable
private fun Picker(label: String, options: List<String>, selected: Int, onSelect: (Int) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text("$label:", modifier = Modifier.width(90.dp))
        Box {
            OutlinedButton(onClick = { expanded = true }) { Text(options[selected]) }
            DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                options.forEachIndexed { index, name ->
                    DropdownMenuItem(text = { Text(name) }, onClick = { onSelect(index); expanded = false })
                }
            }
        }
    }
}

private fun format(v: Double): String = String.format(Locale.US, "%.4f", v).trimEnd('0').trimEnd('.')
