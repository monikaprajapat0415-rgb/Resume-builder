package com.example.expenses

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [Expense::class], version = 1, exportSchema = false)
abstract class ExpenseDatabase : RoomDatabase() {
    abstract fun dao(): ExpenseDao

    companion object {
        @Volatile private var instance: ExpenseDatabase? = null
        fun get(context: Context): ExpenseDatabase = instance ?: synchronized(this) {
            instance ?: Room.databaseBuilder(context.applicationContext, ExpenseDatabase::class.java, "expenses.db")
                .build().also { instance = it }
        }
    }
}
