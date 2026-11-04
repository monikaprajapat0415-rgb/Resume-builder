package com.example.recipes

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface FavouriteDao {
    @Query("SELECT * FROM favourites ORDER BY name")
    fun observeAll(): Flow<List<Favourite>>

    @Query("SELECT EXISTS(SELECT 1 FROM favourites WHERE id = :id)")
    fun observeIsFavourite(id: String): Flow<Boolean>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun add(favourite: Favourite)

    @Query("DELETE FROM favourites WHERE id = :id")
    suspend fun remove(id: String)
}

@Database(entities = [Favourite::class], version = 1, exportSchema = false)
abstract class AppDb : RoomDatabase() {
    abstract fun favouriteDao(): FavouriteDao
}
