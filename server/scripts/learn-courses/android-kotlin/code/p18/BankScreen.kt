package com.example.bank

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp

@Composable
fun BankApp(vm: BankViewModel, askBiometric: (onOk: () -> Unit) -> Unit) {
    val s by vm.state.collectAsState()
    when {
        !s.loggedIn -> Login(vm, s)
        !s.unlocked -> Column(Modifier.fillMaxSize().padding(24.dp), verticalArrangement = Arrangement.Center) {
            Text("Locked", style = MaterialTheme.typography.headlineMedium)
            Button(onClick = { askBiometric(vm::unlocked) }) { Text("Unlock with fingerprint or face") }
            TextButton(onClick = vm::logout) { Text("Sign out") }
        }
        else -> Home(vm, s)
    }
}

@Composable
private fun Login(vm: BankViewModel, s: BankState) {
    var user by remember { mutableStateOf("") }
    var pass by remember { mutableStateOf("") }
    Column(Modifier.fillMaxSize().padding(24.dp), verticalArrangement = Arrangement.Center) {
        Text("Sign in", style = MaterialTheme.typography.headlineMedium)
        OutlinedTextField(user, { user = it }, label = { Text("User name") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(
            pass, { pass = it }, label = { Text("Password") },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth(),
        )
        s.error?.let { Text(it, color = MaterialTheme.colorScheme.error) }
        Button(onClick = { vm.login(user, pass) }, enabled = !s.loading, modifier = Modifier.padding(top = 12.dp)) {
            Text(if (s.loading) "Signing in..." else "Sign in")
        }
    }
}

@Composable
private fun Home(vm: BankViewModel, s: BankState) {
    var to by remember { mutableStateOf("") }
    var amount by remember { mutableStateOf("") }
    val balance = BankRules.balance(s.transactions)

    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("Balance", style = MaterialTheme.typography.titleMedium)
            TextButton(onClick = vm::logout) { Text("Sign out") }
        }
        Text(balance.asMoney(), style = MaterialTheme.typography.displaySmall)
        OutlinedTextField(to, { to = it }, label = { Text("To account") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(amount, { amount = it }, label = { Text("Amount") }, modifier = Modifier.fillMaxWidth())
        Button(onClick = { vm.transfer(to, amount) }) { Text("Send") }
        s.message?.let { Text(it) }
        s.error?.let { Text(it, color = MaterialTheme.colorScheme.error) }
        Text("Recent transactions", style = MaterialTheme.typography.titleMedium)
        LazyColumn(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            items(s.transactions, key = { it.id }) { t ->
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Column {
                        Text(t.title)
                        Text(t.date, style = MaterialTheme.typography.bodySmall)
                    }
                    Text(t.amountCents.asMoney())
                }
            }
        }
    }
}
