package com.example.expenses

import androidx.room.Entity
import androidx.room.PrimaryKey

// Money is stored as whole cents (a Long), never as Double, so 0.1 + 0.2 never goes wrong.
@Entity(tableName = "expenses")
data class Expense(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val amountCents: Long,
    val category: String,
    val dateMillis: Long = System.currentTimeMillis()
)

data class CategoryTotal(val category: String, val total: Long)

val categoryNames = listOf("Food", "Transport", "Bills", "Shopping", "Fun", "Other")

fun Long.asMoney(): String = "%d.%02d".format(this / 100, this % 100)

/** Turns text such as "12.5" into 1250 cents. Returns null when the text is not a positive amount. */
fun parseCents(text: String): Long? {
    val value = text.trim().toBigDecimalOrNull() ?: return null
    if (value.signum() <= 0) return null
    return value.movePointRight(2).setScale(0, java.math.RoundingMode.HALF_UP).toLong()
}
