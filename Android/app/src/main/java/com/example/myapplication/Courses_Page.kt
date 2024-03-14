package com.example.myapplication

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.Adapter
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import com.example.myapplication.databinding.ActivityCoursesPageBinding
import com.example.myapplication.databinding.ActivityMainBinding


import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.PlayerConstants.PlayerState
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.YouTubePlayer
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.listeners.AbstractYouTubePlayerListener
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.utils.YouTubePlayerTracker


data class CustomStructure(val imageResource: Int, val text1: String, val text2: String)

class Courses_Page : AppCompatActivity() {



    val item1 = CustomStructure(R.drawable.baseline_home_24, "Text1-1", "Text2-1")
    val item2 = CustomStructure(R.drawable.baseline_home_24, "Text1-2", "Text2-2")
    val item3 = CustomStructure(R.drawable.baseline_home_24, "Text1-3", "Text2-3")

    val items = arrayOf("hello","hello","hello","hello" )

    private var lastBackPressedTime = 0L
    private val exitConfirmationThreshold = 2000 // 2 seconds
    private lateinit var binding: ActivityCoursesPageBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCoursesPageBinding.inflate(layoutInflater)
        setContentView(binding.root)

        //val listview = binding.listView


        val playerView = binding.youtubePlayerView

        playerView.addYouTubePlayerListener(object : AbstractYouTubePlayerListener() {
            override fun onReady(youTubePlayer: YouTubePlayer) {
                val playlistId = "PLaQzmDaYayMCuW3Y0LhKnYON8u5_QQYsW"

            }
        })






    }
    override fun onBackPressed() {
        val currentTime = System.currentTimeMillis()
        if (currentTime - lastBackPressedTime < exitConfirmationThreshold) {
            // If the time between presses is less than the threshold, exit the app
            finish()
        } else {
            // If the time between presses is greater than the threshold, show a confirmation dialog
            showExitConfirmationDialog()
        }
        lastBackPressedTime = currentTime
    }
    //the dialog of the back button
    private fun showExitConfirmationDialog() {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Exit Confirmation")
        builder.setMessage("Are you sure you want to exit?")
        builder.setPositiveButton("Yes") { _, _ ->
            exitApplication()
        }
        builder.setNegativeButton("No") { dialog, _ ->
            dialog.dismiss()
        }
        builder.show()
    }
    //to exit from the  entire app
    private fun exitApplication() {
        finishAffinity()
        System.exit(0)
    }
}