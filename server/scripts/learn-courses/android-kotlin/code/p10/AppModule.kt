package com.example.recipes

import android.content.Context
import androidx.room.Room
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory
import javax.inject.Singleton

// A module tells Hilt how to build things it cannot build by itself (Retrofit, Room).
@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides @Singleton
    fun mealApi(): MealApi = Retrofit.Builder()
        .baseUrl("https://www.themealdb.com/api/json/v1/1/")
        .addConverterFactory(Json { ignoreUnknownKeys = true }.asConverterFactory("application/json".toMediaType()))
        .build()
        .create(MealApi::class.java)

    @Provides @Singleton
    fun database(@ApplicationContext context: Context): AppDb =
        Room.databaseBuilder(context, AppDb::class.java, "recipes.db").build()

    @Provides
    fun favouriteDao(db: AppDb): FavouriteDao = db.favouriteDao()
}
