package com.example.signlanguagetranslator


import android.Manifest
import android.content.ContentUris
import android.content.ContentValues
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.MediaStore
import android.widget.ImageButton
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.core.Camera
import androidx.camera.core.CameraSelector
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.video.MediaStoreOutputOptions
import androidx.camera.video.Quality
import androidx.camera.video.QualitySelector
import androidx.camera.video.Recorder
import androidx.camera.video.Recording
import androidx.camera.video.VideoCapture
import androidx.camera.video.VideoRecordEvent
import androidx.camera.view.PreviewView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class CameraX : AppCompatActivity() {

    private lateinit var service: ExecutorService
    private var recording: Recording? = null
    private var videoCapture: VideoCapture<Recorder>? = null
    private var cameraFacing = CameraSelector.LENS_FACING_BACK

    private val activityResultLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { result ->
            if (result) {
                if (ActivityCompat.checkSelfPermission(
                        this,
                        Manifest.permission.CAMERA
                    ) == PackageManager.PERMISSION_GRANTED
                ) {
                    startCamera(cameraFacing)
                }
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_camera_x)
        service = Executors.newSingleThreadExecutor()

        val capture = findViewById<ImageButton>(R.id.capture)
        val flipCamera = findViewById<ImageButton>(R.id.flipCamera)

        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            startCamera(cameraFacing)
        } else {
            activityResultLauncher.launch(Manifest.permission.CAMERA)
        }

        capture.setOnClickListener {
            when {
                ActivityCompat.checkSelfPermission(
                    this,
                    Manifest.permission.CAMERA
                ) != PackageManager.PERMISSION_GRANTED -> activityResultLauncher.launch(Manifest.permission.CAMERA)

                ActivityCompat.checkSelfPermission(
                    this,
                    Manifest.permission.RECORD_AUDIO
                ) != PackageManager.PERMISSION_GRANTED -> activityResultLauncher.launch(
                    Manifest.permission.RECORD_AUDIO
                )

                Build.VERSION.SDK_INT <= Build.VERSION_CODES.P && ActivityCompat.checkSelfPermission(
                    this,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE
                ) != PackageManager.PERMISSION_GRANTED -> activityResultLauncher.launch(
                    Manifest.permission.WRITE_EXTERNAL_STORAGE
                )

                else -> captureVideo()
            }
        }

        flipCamera.setOnClickListener {
            cameraFacing = if (cameraFacing == CameraSelector.LENS_FACING_BACK) {
                CameraSelector.LENS_FACING_FRONT
            } else {
                CameraSelector.LENS_FACING_BACK
            }
            startCamera(cameraFacing)
        }
    }

    private fun startCamera(cameraFacing: Int) {
        val processCameraProviderFuture = ProcessCameraProvider.getInstance(this)

        processCameraProviderFuture.addListener({
            try {
                val cameraProvider = processCameraProviderFuture.get()
                val preview = Preview.Builder().build().also {
                    it.setSurfaceProvider(findViewById<PreviewView>(R.id.viewFinder).surfaceProvider)
                }

                val recorder = Recorder.Builder()
                    .setQualitySelector(QualitySelector.from(Quality.LOWEST))
                    .build()
                videoCapture = VideoCapture.withOutput(recorder)

                cameraProvider.unbindAll()

                val cameraSelector = CameraSelector.Builder()
                    .requireLensFacing(cameraFacing).build()

                val camera = cameraProvider.bindToLifecycle(
                    this,
                    cameraSelector,
                    preview,
                    videoCapture
                )

                findViewById<ImageButton>(R.id.toggleFlash).setOnClickListener {
                    toggleFlash(camera)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }, ContextCompat.getMainExecutor(this))
    }

    private fun toggleFlash(camera: Camera) {
        if (camera.cameraInfo.hasFlashUnit()) {
            val currentTorchState = camera.cameraInfo.torchState.value ?: 0
            camera.cameraControl.enableTorch(currentTorchState == 0)
            val toggleFlash = findViewById<ImageButton>(R.id.toggleFlash)
            toggleFlash.setImageResource(if (currentTorchState == 0) R.drawable.round_flash_off_24 else R.drawable.round_flash_on_24)
        } else {
            runOnUiThread {
                Toast.makeText(this, "Flash is not available currently", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        service.shutdown()
    }

    private fun captureVideo() {
        val capture = findViewById<ImageButton>(R.id.capture)
        capture.setImageResource(R.drawable.round_stop_circle_24)

        val recording1 = recording
        if (recording1 != null) {
            stopRecording()
            return
        }

        val fixedName = "Sign_video.mp4"
        val contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI

        val projection = arrayOf(MediaStore.Video.Media._ID)
        val selection = "${MediaStore.MediaColumns.DISPLAY_NAME} = ?"
        val selectionArgs = arrayOf(fixedName)

        contentResolver.query(contentUri, projection, selection, selectionArgs, null)?.use { cursor ->
            if (cursor.moveToFirst()) {
                val id = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Video.Media._ID))
                val uri = ContentUris.withAppendedId(contentUri, id)
                contentResolver.delete(uri, null, null)
            }
        }

        val contentValues = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, fixedName)
            put(MediaStore.MediaColumns.MIME_TYPE, "video/mp4")
            put(MediaStore.Video.Media.RELATIVE_PATH, "Movies/CameraX-Video")
        }

        val options = MediaStoreOutputOptions.Builder(
            contentResolver,
            contentUri
        )
            .setContentValues(contentValues).build()

        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.RECORD_AUDIO
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            return
        }

        recording = videoCapture?.output?.prepareRecording(this, options)?.withAudioEnabled()
            ?.start(ContextCompat.getMainExecutor(this)) { videoRecordEvent ->
                when (videoRecordEvent) {
                    is VideoRecordEvent.Start -> {
                        capture.isEnabled = true
                    }

                    is VideoRecordEvent.Finalize -> {
                        capture.setImageResource(R.drawable.round_fiber_manual_record_24)
                        videoRecordEvent.outputResults.outputUri?.let { uri ->
                            uploadVideoToServer(uri)
                        }
                    }
                }
            }
    }

    private fun stopRecording() {
        recording?.let {
            val capture = findViewById<ImageButton>(R.id.capture)
            capture.isEnabled = false
            runBlocking {
                withContext(Dispatchers.IO) {
                    it.stop()
                }
            }
            recording = null
            capture.isEnabled = true
        }
    }

    fun uploadVideoToServer(uri: Uri) {
        val file = getFileFromUri(uri)
        file?.let {
            val requestFile = RequestBody.create("video/mp4".toMediaTypeOrNull(), it)
            val body = MultipartBody.Part.createFormData("video", it.name, requestFile)

            val apiService = ApiClient.retrofit.create(ApiService::class.java)
            apiService.uploadVideo(body).enqueue(object : Callback<PredictionResponse> {
                override fun onResponse(call: Call<PredictionResponse>, response: Response<PredictionResponse>) {
                    if (response.isSuccessful) {
                        response.body()?.let { predictionResponse ->
                            showPredictionDialog(predictionResponse.prediction)
                        }
                    } else {
                        Toast.makeText(this@CameraX, "Video upload failed: ${response.message()}", Toast.LENGTH_LONG).show()
                    }
                }

                override fun onFailure(call: Call<PredictionResponse>, t: Throwable) {
                    Toast.makeText(this@CameraX, "Video upload failed: ${t.message}", Toast.LENGTH_LONG).show()
                }
            })
        }
    }

    private fun showPredictionDialog(prediction: String) {
        AlertDialog.Builder(this@CameraX).apply {
            setTitle("Prediction")
            setMessage(prediction)
            setPositiveButton("OK") { dialog, _ -> dialog.dismiss() }
            create()
            show()
        }
    }


    private fun getFileFromUri(uri: Uri): File? {
        return try {
            val inputStream: InputStream? = contentResolver.openInputStream(uri)
            val file = File(cacheDir, "sign_video.mp4")
            val outputStream = FileOutputStream(file)
            inputStream?.copyTo(outputStream)
            outputStream.close()
            inputStream?.close()
            file
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}
