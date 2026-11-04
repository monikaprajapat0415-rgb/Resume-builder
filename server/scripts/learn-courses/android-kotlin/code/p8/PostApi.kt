package com.example.posts

import kotlinx.serialization.Serializable
import retrofit2.http.GET
import retrofit2.http.Path

// jsonplaceholder.typicode.com is a free practice API. The posts are fake text.
@Serializable
data class Post(val id: Int, val userId: Int, val title: String, val body: String)

interface PostApi {
    @GET("posts")
    suspend fun posts(): List<Post>

    @GET("posts/{id}")
    suspend fun post(@Path("id") id: Int): Post
}
