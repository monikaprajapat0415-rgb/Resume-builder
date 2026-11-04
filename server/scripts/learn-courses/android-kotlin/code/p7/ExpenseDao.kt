package com.example.expenses

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface ExpenseDao {
    @Query("SELECT * FROM expenses ORDER BY dateMillis DESC")
    fun observeAll(): Flow<List<Expense>>

    // The database does the adding up. The result maps straight onto CategoryTotal.
    @Query("SELECT category, SUM(amountCents) AS total FROM expenses GROUP BY category ORDER BY total DESC")
    fun observeTotals(): Flow<List<CategoryTotal>>

    @Query("SELECT COALESCE(SUM(amountCents), 0) FROM expenses")
    fun observeGrandTotal(): Flow<Long>

    @Insert
    suspend fun insert(expense: Expense)

    @Delete
    suspend fun delete(expense: Expense)
}
