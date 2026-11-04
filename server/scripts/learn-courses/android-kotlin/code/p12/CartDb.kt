package com.example.shop

import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.RoomDatabase
import androidx.room.Upsert
import kotlinx.coroutines.flow.Flow

// price is stored in cents so totals are exact
@Entity(tableName = "cart_line")
data class CartLine(
    @PrimaryKey val productId: Int,
    val title: String,
    val image: String,
    val priceCents: Long,
    val quantity: Int,
)

@Dao
interface CartDao {
    @Query("SELECT * FROM cart_line ORDER BY title")
    fun lines(): Flow<List<CartLine>>

    @Query("SELECT * FROM cart_line WHERE productId = :id")
    suspend fun find(id: Int): CartLine?

    @Upsert
    suspend fun save(line: CartLine)

    @Query("DELETE FROM cart_line WHERE productId = :id")
    suspend fun remove(id: Int)

    @Query("DELETE FROM cart_line")
    suspend fun clear()
}

@Database(entities = [CartLine::class], version = 1, exportSchema = false)
abstract class CartDatabase : RoomDatabase() {
    abstract fun cart(): CartDao
}
