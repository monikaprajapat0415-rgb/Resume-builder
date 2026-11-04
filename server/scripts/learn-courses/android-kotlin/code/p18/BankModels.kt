package com.example.bank

import kotlinx.serialization.Serializable

@Serializable
data class LoginBody(val username: String, val password: String)

@Serializable
data class LoginReply(val token: String)

@Serializable
data class Transaction(
    val id: String,
    val title: String,
    val amountCents: Long,      // negative = money out
    val date: String,
)

// Pure rules, easy to test.
object BankRules {
    fun balance(list: List<Transaction>): Long = list.sumOf { it.amountCents }

    fun canTransfer(balanceCents: Long, amountCents: Long): Boolean {
        return amountCents > 0 && amountCents <= balanceCents
    }

    fun mask(account: String): String {
        if (account.length <= 4) return account
        return "•".repeat(account.length - 4) + account.takeLast(4)
    }
}

fun Long.asMoney(): String {
    val sign = if (this < 0) "-" else ""
    val abs = kotlin.math.abs(this)
    return sign + (abs / 100) + "." + (abs % 100).toString().padStart(2, '0')
}
