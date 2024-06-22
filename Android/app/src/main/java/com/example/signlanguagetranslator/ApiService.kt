package com.example.signlanguagetranslator

import okhttp3.MultipartBody
import retrofit2.Call
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part

data class PredictionResponse(
    val prediction: String
)

interface ApiService {
    @Multipart
    @POST("/upload")
    fun uploadVideo(
        @Part video: MultipartBody.Part,
    ): Call<PredictionResponse>
}
