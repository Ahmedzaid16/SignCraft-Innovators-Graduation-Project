package com.example.signlanguagetranslator

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object VoiceApiClient {
    private const val BASE_URL = "http://mustafakhaled.pythonanywhere.com"

    private val okHttpClient = OkHttpClient.Builder().build()

    val instance: VoiceApiService by lazy {
        val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        retrofit.create(VoiceApiService::class.java)
    }
}
