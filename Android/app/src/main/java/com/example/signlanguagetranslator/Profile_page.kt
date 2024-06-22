package com.example.signlanguagetranslator

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.example.signlanguagetranslator.databinding.ActivityProfilePageBinding


private lateinit var binding: ActivityProfilePageBinding


private var backPressedTime: Long = 0
private val EXIT_DELAY = 2000L // 2 seconds for double-press confirmation



class Profile_page : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityProfilePageBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.educaitonIcon.setOnClickListener {
            val intent = Intent(this, Education_page::class.java)
            startActivity(intent)
        }
        binding.translateIcon.setOnClickListener {
            val intent = Intent(this, Translate_page::class.java)
            startActivity(intent)
        }

        binding.logoutBar.setOnClickListener {
            showLogoutDialog()
        }

        /*val username = intent.getStringExtra("username")
        val phoneNumber = intent.getStringExtra("phonenumber")

        binding.usernameTxt.setText(username)
        binding.phonenumTxt.setText(phoneNumber)*/

    }

    private fun showLogoutDialog() {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Logout")
        builder.setMessage("Are you sure you want to logout?")

        builder.setPositiveButton("Yes") { dialog, which ->
            // Handle the logout process here
            logout()
        }

        builder.setNegativeButton("No") { dialog, which ->
            dialog.dismiss()
        }

        val dialog: AlertDialog = builder.create()
        dialog.show()
    }

    private fun logout() {
        val intent = Intent(this , SignUp_page::class.java)
        startActivity(intent)
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
}