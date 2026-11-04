package com.example.tipcalc

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
fun TipScreen() {
    // State: when any of these change, Compose redraws the parts that read them.
    var billText by remember { mutableStateOf("") }
    var tipPercent by remember { mutableFloatStateOf(15f) }
    var people by remember { mutableIntStateOf(1) }
    var roundUp by remember { mutableStateOf(false) }

    val bill = billText.toDoubleOrNull() ?: 0.0
    val result = calculateTip(bill, tipPercent.toInt(), people, roundUp)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .systemBarsPadding()
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("Tip Calculator", style = MaterialTheme.typography.headlineMedium)

        OutlinedTextField(
            value = billText,
            onValueChange = { billText = it },
            label = { Text("Bill amount") },
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
            modifier = Modifier.fillMaxWidth()
        )

        Text("Tip: ${tipPercent.toInt()}%")
        Slider(
            value = tipPercent,
            onValueChange = { tipPercent = it },
            valueRange = 0f..30f,
            steps = 29
        )

        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("People: $people", modifier = Modifier.weight(1f))
            OutlinedButton(onClick = { if (people > 1) people-- }) { Text("-") }
            Spacer(Modifier.width(8.dp))
            OutlinedButton(onClick = { people++ }) { Text("+") }
        }

        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("Round the tip up", modifier = Modifier.weight(1f))
            Switch(checked = roundUp, onCheckedChange = { roundUp = it })
        }

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text("Tip: ${money(result.tip)}")
                Text("Total: ${money(result.total)}")
                Text(
                    "Each person pays: ${money(result.perPerson)}",
                    style = MaterialTheme.typography.titleMedium
                )
            }
        }
    }
}

private fun money(value: Double): String = String.format(Locale.US, "%.2f", value)
