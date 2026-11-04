package com.example.shop

import kotlinx.serialization.Serializable
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

@Serializable
data class ProductDto(
    val id: Int,
    val title: String,
    val price: Double,
    val description: String = "",
    val category: String = "",
    val image: String = "",
)

@Serializable
data class LoginRequest(val username: String, val password: String)

@Serializable
data class LoginResponse(val token: String)

interface ShopApi {
    @GET("products")
    suspend fun products(): List<ProductDto>

    @GET("products/{id}")
    suspend fun product(@Path("id") id: Int): ProductDto

    @POST("auth/login")
    suspend fun login(@Body body: LoginRequest): LoginResponse
}
