package com.example.myapplication

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import com.example.myapplication.databinding.ActivityMainBinding
import com.example.myapplication.databinding.ActivitySingUpBinding

lateinit var profile_icon: ImageView
lateinit var Education_icon: ImageView

class MainActivity : AppCompatActivity() {

    private var lastBackPressedTime = 0L
    private val exitConfirmationThreshold = 2000 // 2 seconds

    private lateinit var binding: ActivityMainBinding


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        profile_icon = binding.profileIcon
        profile_icon.setOnClickListener{
            val intent = Intent(this, Profile_page::class.java)
            startActivity(intent)
        }
        Education_icon = binding.educaitonIcon
        Education_icon.setOnClickListener {
            val intent = Intent(this , Courses_Page::class.java)
            startActivity(intent)
        }

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