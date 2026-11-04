package com.example.weather

import retrofit2.converter.kotlinx.serialization.asConverterFactory
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import retrofit2.Retrofit

data class Weather(val place: String, val current: Current, val daily: Daily)

class CityNotFound(val city: String) : Exception("No place called \"$city\" was found")

class WeatherRepository {
    private val json = Json { ignoreUnknownKeys = true }
    private fun retrofit(base: String) = Retrofit.Builder()
        .baseUrl(base)
        .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
        .build()

    private val geo = retrofit("https://geocoding-api.open-meteo.com/").create(GeoApi::class.java)
    private val forecast = retrofit("https://api.open-meteo.com/").create(ForecastApi::class.java)

    suspend fun load(city: String): Weather {
        val place = geo.search(city.trim()).results?.firstOrNull() ?: throw CityNotFound(city)
        val data = forecast.forecast(place.latitude, place.longitude)
        return Weather(listOfNotNull(place.name, place.country).joinToString(", "), data.current, data.daily)
    }
}

fun describe(code: Int): String = when (code) {
    0 -> "Clear sky"
    1, 2, 3 -> "Partly cloudy"
    45, 48 -> "Fog"
    in 51..57 -> "Drizzle"
    in 61..67 -> "Rain"
    in 71..77 -> "Snow"
    in 80..82 -> "Rain showers"
    in 95..99 -> "Thunderstorm"
    else -> "Unknown"
}
