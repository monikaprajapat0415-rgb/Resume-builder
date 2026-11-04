package com.example.weather

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import retrofit2.http.GET
import retrofit2.http.Query

@Serializable
data class GeoResponse(val results: List<GeoPlace>? = null)

@Serializable
data class GeoPlace(val name: String, val latitude: Double, val longitude: Double, val country: String? = null)

@Serializable
data class ForecastResponse(val current: Current, val daily: Daily)

@Serializable
data class Current(
    @SerialName("temperature_2m") val temperature: Double,
    @SerialName("wind_speed_10m") val windSpeed: Double,
    @SerialName("weather_code") val weatherCode: Int
)

@Serializable
data class Daily(
    val time: List<String>,
    @SerialName("temperature_2m_max") val max: List<Double>,
    @SerialName("temperature_2m_min") val min: List<Double>
)

interface GeoApi {
    @GET("v1/search")
    suspend fun search(@Query("name") name: String, @Query("count") count: Int = 1): GeoResponse
}

interface ForecastApi {
    @GET("v1/forecast")
    suspend fun forecast(
        @Query("latitude") lat: Double,
        @Query("longitude") lon: Double,
        @Query("current") current: String = "temperature_2m,wind_speed_10m,weather_code",
        @Query("daily") daily: String = "temperature_2m_max,temperature_2m_min",
        @Query("timezone") timezone: String = "auto"
    ): ForecastResponse
}
