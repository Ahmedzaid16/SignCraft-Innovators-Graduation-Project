package com.example.signlanguagetranslator

import okhttp3.MultipartBody
import retrofit2.Call
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part

interface VoiceApiService {
    @Multipart
    @POST("/upload")
    fun uploadAudio(
        @Part file: MultipartBody.Part
    ): Call<TranscriptionResponse>
}

data class TranscriptionResponse(
    val transcription: String?,
    val error: String?
)
