package com.example.aichat

import androidx.room.Dao
import androidx.room.Database
import androidx.room.Insert
import androidx.room.Query
import androidx.room.RoomDatabase
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface MessageDao {
    @Query("SELECT * FROM chat_message ORDER BY id")
    fun all(): Flow<List<StoredMessage>>

    @Insert
    suspend fun insert(message: StoredMessage): Long

    @Update
    suspend fun update(message: StoredMessage)

    @Query("DELETE FROM chat_message")
    suspend fun clear()
}

@Database(entities = [StoredMessage::class], version = 1, exportSchema = false)
abstract class ChatDatabase : RoomDatabase() {
    abstract fun messages(): MessageDao
}
