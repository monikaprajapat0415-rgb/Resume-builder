package com.example.expenses

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class ExpenseViewModel(app: Application) : AndroidViewModel(app) {
    private val dao = ExpenseDatabase.get(app).dao()
    private fun <T> kotlinx.coroutines.flow.Flow<T>.asState(initial: T): StateFlow<T> =
        stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), initial)

    val expenses = dao.observeAll().asState(emptyList())
    val totals = dao.observeTotals().asState(emptyList())
    val grandTotal = dao.observeGrandTotal().asState(0L)

    /** Returns an error message, or null when the expense was saved. */
    fun add(title: String, amountText: String, category: String): String? {
        if (title.isBlank()) return "Give the expense a name"
        val cents = parseCents(amountText) ?: return "Enter an amount above zero, such as 12.50"
        viewModelScope.launch { dao.insert(Expense(title = title.trim(), amountCents = cents, category = category)) }
        return null
    }

    fun delete(expense: Expense) {
        viewModelScope.launch { dao.delete(expense) }
    }
}
