package com.example.myapplication

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import com.example.myapplication.databinding.ActivitySingUpBinding
import com.google.firebase.Firebase
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth
import kotlin.system.exitProcess

lateinit var singin_clk_txt:TextView

class SingUp : AppCompatActivity() {

    private var lastBackPressedTime = 0L
    private val exitConfirmationThreshold = 2000 // 2 seconds
    private lateinit var binding: ActivitySingUpBinding
    private lateinit var firebaseAuth: FirebaseAuth


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySingUpBinding.inflate(layoutInflater)
        setContentView(binding.root)


        singin_clk_txt = binding.singinClickableTxt
        singin_clk_txt.setOnClickListener{
            var intent = Intent(this,SingIn::class.java)
            startActivity(intent)
        }

        firebaseAuth = FirebaseAuth.getInstance()

        binding.singupBtn.setOnClickListener{
            val username = binding.usernameEdt.text.toString()
            val email = binding.emailEdt.text.toString()
            val password = binding.passwordEdt.text.toString()
            val confirmpass = binding.confirmPasswordEdt.text.toString()
            val birthofdate = binding.birthdateEdt.text.toString()
            val male = binding.checkBoxMale.text.toString()
            val female = binding.checkBoxFemale.text.toString()
            val userstate = binding.deafNormalUser.text.toString()

            if(username.isNotEmpty() && email.isNotEmpty() && password.isNotEmpty() && confirmpass.isNotEmpty()){

                if(password == confirmpass){
                    firebaseAuth.createUserWithEmailAndPassword(email,password ).addOnCompleteListener{
                        if(it.isSuccessful){
                            val intent = Intent(this , SingIn::class.java)
                            Toast.makeText(this, "user successfully singup",Toast.LENGTH_SHORT).show()
                            startActivity(intent)
                        }else{
                            Toast.makeText(this, it.exception.toString(),Toast.LENGTH_SHORT).show()
                        }
                    }
                }else{
                    Toast.makeText(this, "password does not matched",Toast.LENGTH_SHORT).show()
                }
            }
            else{
                Toast.makeText(this, "Field can not be empty!",Toast.LENGTH_SHORT).show()
            }
        }
    }

    //when press back button ask if you want to exit from the application or not
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