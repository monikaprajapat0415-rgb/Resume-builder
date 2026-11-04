package com.example.bank

import okhttp3.Interceptor
import okhttp3.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

// This is the contract your own bank-style backend must provide.
// Never ship real banking features without a server that enforces every rule.
interface BankApi {
    @POST("login")
    suspend fun login(@Body body: LoginBody): LoginReply

    @GET("transactions")
    suspend fun transactions(): List<Transaction>

    @POST("transfer")
    suspend fun transfer(@Body body: TransferBody)
}

@kotlinx.serialization.Serializable
data class TransferBody(val toAccount: String, val amountCents: Long)

class BearerInterceptor(private val vault: TokenVault) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val token = vault.read()
        val builder = chain.request().newBuilder()
        if (token != null) builder.header("Authorization", "Bearer " + token)
        return chain.proceed(builder.build())
    }
}
