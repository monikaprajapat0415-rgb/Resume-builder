package com.example.jobs

import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.http.GET
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Path
import retrofit2.http.Query

// The contract your own backend provides. The job list and applications are stored on the server.
interface JobApi {
    @GET("jobs")
    suspend fun jobs(@Query("page") page: Int): List<Job>

    @Multipart
    @POST("jobs/{id}/apply")
    suspend fun apply(
        @Path("id") id: String,
        @Part("cover") cover: RequestBody,
        @Part resume: MultipartBody.Part,
    ): ApplyResult
}
