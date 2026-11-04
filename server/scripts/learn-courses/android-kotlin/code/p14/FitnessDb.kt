package com.example.fitness

import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.RoomDatabase
import androidx.room.Upsert
import kotlinx.coroutines.flow.Flow

// one row for each day: date key like 2026-11-04
@Entity(tableName = "day_steps")
data class DaySteps(
    @PrimaryKey val day: String,
    val steps: Int,
    val baseline: Float,
)

@Dao
interface StepsDao {
    @Query("SELECT * FROM day_steps ORDER BY day DESC LIMIT 7")
    fun lastWeek(): Flow<List<DaySteps>>

    @Query("SELECT * FROM day_steps WHERE day = :day")
    suspend fun forDay(day: String): DaySteps?

    @Upsert
    suspend fun save(row: DaySteps)
}

@Database(entities = [DaySteps::class], version = 1, exportSchema = false)
abstract class FitnessDatabase : RoomDatabase() {
    abstract fun steps(): StepsDao
}
