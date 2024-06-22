package com.example.signlanguagetranslator

import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import com.example.signlanguagetranslator.databinding.ActivityTranslatePageBinding
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.File

private lateinit var binding: ActivityTranslatePageBinding

private var backPressedTime: Long = 0
private val EXIT_DELAY = 2000L // 2 seconds for double-press confirmation

class Translate_page : AppCompatActivity() {

    private val REQUEST_RECORD_AUDIO_PERMISSION = 200
    private val permissions = arrayOf(android.Manifest.permission.RECORD_AUDIO, android.Manifest.permission.READ_EXTERNAL_STORAGE)

    private fun requestAudioPermissions() {
        ActivityCompat.requestPermissions(this, permissions, REQUEST_RECORD_AUDIO_PERMISSION)
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == REQUEST_RECORD_AUDIO_PERMISSION) {
            if (grantResults.isEmpty() || grantResults.any { it != PackageManager.PERMISSION_GRANTED }) {
                // Permission denied, handle appropriately
                Toast.makeText(this, "Permission denied", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityTranslatePageBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.voiceIcon.setOnClickListener {
            requestAudioPermissions()
            uploadAudioFile()
        }

        binding.educaitonIcon.setOnClickListener {
            val intent = Intent(this, Education_page::class.java)
            startActivity(intent)
        }
        binding.profileIcon.setOnClickListener {
            val intent = Intent(this, Profile_page::class.java)
            startActivity(intent)
        }
        binding.cameraIcon.setOnClickListener {
            val intent = Intent(this, CameraX::class.java)
            startActivity(intent)
        }
    }

    override fun onBackPressed() {
        if (System.currentTimeMillis() - backPressedTime < EXIT_DELAY) {
            super.onBackPressed()
            finishAffinity() // Finish all activities in the stack
        } else {
            backPressedTime = System.currentTimeMillis()
            Toast.makeText(this, "Press back again to exit", Toast.LENGTH_SHORT).show()
        }
    }

    private fun uploadAudioFile() {
        //file can be edit from the phone because there is a problem when record and send to the server direectly
        // Path to the pre-existing file
        val filePath = "/storage/emulated/0/Download/السلام عليكم.wav"
        val file = File(filePath)

        if (!file.exists()) {
            Toast.makeText(this, "File not found", Toast.LENGTH_SHORT).show()
            return
        }

        val requestFile = RequestBody.create("audio/wav".toMediaTypeOrNull(), file)
        val body = MultipartBody.Part.createFormData("file", file.name, requestFile)

        val call = VoiceApiClient.instance.uploadAudio(body)
        call.enqueue(object : Callback<TranscriptionResponse> {
            override fun onResponse(call: Call<TranscriptionResponse>, response: Response<TranscriptionResponse>) {
                if (response.isSuccessful) {
                    val transcriptionResponse = response.body()
                    transcriptionResponse?.transcription?.let {
                        binding.TranslateEdt.setText(it)
                    } ?: run {
                        Toast.makeText(this@Translate_page, "Transcription failed", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Toast.makeText(this@Translate_page, "Server error: ${response.message()}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<TranscriptionResponse>, t: Throwable) {
                Toast.makeText(this@Translate_page, "Upload failed: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}