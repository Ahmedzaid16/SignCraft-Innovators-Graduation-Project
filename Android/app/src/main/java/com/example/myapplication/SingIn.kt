package com.example.myapplication

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import com.example.myapplication.databinding.ActivitySingInBinding
import com.example.myapplication.databinding.ActivitySingUpBinding
import com.google.firebase.auth.FirebaseAuth

lateinit var singup_clk_txt: TextView

class SingIn : AppCompatActivity() {

    private var lastBackPressedTime = 0L
    private val exitConfirmationThreshold = 2000 // 2 seconds
    private lateinit var binding: ActivitySingInBinding
    private lateinit var firebaseAuth: FirebaseAuth


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

//        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_FULLSCREEN
//        actionBar?.hide()

        binding = ActivitySingInBinding.inflate(layoutInflater)
        setContentView(binding.root)

        firebaseAuth = FirebaseAuth.getInstance()

        binding.singupClickableTxt.setOnClickListener {
            val intent = Intent(this, SingUp::class.java)
            startActivity(intent)
        }

        binding.loginBtn.setOnClickListener {
            val email = binding.EmailEdt.text.toString()
            val password = binding.passwordEdt.text.toString()

            if (email.isNotEmpty() && password.isNotEmpty()) {
                firebaseAuth.signInWithEmailAndPassword(email, password).addOnCompleteListener {
                    if (it.isSuccessful) {
                        val intent = Intent(this, MainActivity::class.java)
                        startActivity(intent)
                    } else {
                        Toast.makeText(this, it.exception.toString(), Toast.LENGTH_SHORT).show()
                    }
                }
            } else {
                Toast.makeText(this, "Field can't be Empty", Toast.LENGTH_SHORT).show()
            }
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