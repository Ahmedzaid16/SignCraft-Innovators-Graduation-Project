package com.example.signlanguagetranslator

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.signlanguagetranslator.databinding.ActivityLoginBinding
import com.google.firebase.auth.FirebaseAuth

private lateinit var binding: ActivityLoginBinding
private lateinit var firebaseAuth: FirebaseAuth


private var backPressedTime: Long = 0
private val EXIT_DELAY = 2000L // 2 seconds for double-press confirmation

class Login : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        firebaseAuth = FirebaseAuth.getInstance()

        binding.signupClickableTxt.setOnClickListener {
            val intent = Intent(this, SignUp_page::class.java)
            startActivity(intent)
        }

        binding.loginBtn.setOnClickListener {
            val email = binding.EmailEdt.text.toString()
            val password = binding.passwordEdt.text.toString()

            if (email.isNotEmpty() && password.isNotEmpty()) {
                firebaseAuth.signInWithEmailAndPassword(email, password).addOnCompleteListener {
                    if (it.isSuccessful) {
                        val intent = Intent(this, Translate_page::class.java)
                        startActivity(intent)
                    } else {
                        Toast.makeText(this, it.exception.toString(), Toast.LENGTH_SHORT).show()
                    }
                }
            } else {
                Toast.makeText(this, "Field can't be Empty", Toast.LENGTH_SHORT).show()
            }
        }
        /*binding.logintxt.setOnClickListener {
            val intent = Intent(this, Translate_page::class.java)
            startActivity(intent)
        }*/
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