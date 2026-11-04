package com.example.bank

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class BankState(
    val loggedIn: Boolean = false,
    val unlocked: Boolean = false,     // passed the biometric check this session
    val loading: Boolean = false,
    val error: String? = null,
    val transactions: List<Transaction> = emptyList(),
    val message: String? = null,
)

class BankViewModel(
    private val api: BankApi,
    private val vault: TokenVault,
) : ViewModel() {

    private val _state = MutableStateFlow(BankState(loggedIn = vault.read() != null))
    val state: StateFlow<BankState> = _state.asStateFlow()

    fun login(user: String, password: String) {
        if (user.isBlank() || password.length < 8) {
            _state.update { it.copy(error = "Enter your user name and a password of 8 or more characters") }
            return
        }
        _state.update { it.copy(loading = true, error = null) }
        viewModelScope.launch {
            try {
                val reply = api.login(LoginBody(user.trim(), password))
                vault.save(reply.token)
                _state.update { it.copy(loggedIn = true, unlocked = true, loading = false) }
                refresh()
            } catch (e: Exception) {
                _state.update { it.copy(loading = false, error = "Sign in failed. Check your details and connection.") }
            }
        }
    }

    fun unlocked() {
        _state.update { it.copy(unlocked = true) }
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            try {
                val list = api.transactions()
                _state.update { it.copy(transactions = list, error = null) }
            } catch (e: Exception) {
                _state.update { it.copy(error = "Could not load transactions") }
            }
        }
    }

    fun transfer(to: String, amountText: String) {
        val cents = parse(amountText)
        val balance = BankRules.balance(_state.value.transactions)
        if (cents == null || !BankRules.canTransfer(balance, cents)) {
            _state.update { it.copy(message = "Enter an amount up to your balance") }
            return
        }
        viewModelScope.launch {
            try {
                api.transfer(TransferBody(to, cents))   // the server checks everything again
                _state.update { it.copy(message = "Transfer sent") }
                refresh()
            } catch (e: Exception) {
                _state.update { it.copy(message = "Transfer failed") }
            }
        }
    }

    fun logout() {
        vault.clear()
        _state.value = BankState()
    }

    private fun parse(text: String): Long? {
        val m = Regex("^(\\d+)(\\.(\\d{1,2}))?$").matchEntire(text.trim()) ?: return null
        val whole = m.groupValues[1].toLong()
        val frac = m.groupValues[3].padEnd(2, '0').ifEmpty { "0" }.toLong()
        return whole * 100 + frac
    }
}
