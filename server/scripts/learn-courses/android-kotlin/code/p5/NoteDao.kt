package com.example.notes

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Query
import androidx.room.Upsert
import kotlinx.coroutines.flow.Flow

@Dao
interface NoteDao {
    // A Flow re-emits every time the table changes, so the screen updates by itself.
    @Query("SELECT * FROM notes ORDER BY updatedAt DESC")
    fun observeAll(): Flow<List<Note>>

    @Upsert
    suspend fun save(note: Note)

    @Delete
    suspend fun delete(note: Note)
}
