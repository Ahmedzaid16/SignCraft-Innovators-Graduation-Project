package com.example.signlanguagetranslator

import android.app.DatePickerDialog
import android.content.Intent
import android.os.Bundle
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.signlanguagetranslator.databinding.ActivitySignUpPageBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.FirebaseDatabase
import java.util.Calendar

private lateinit var binding:ActivitySignUpPageBinding

private lateinit var firebaseauth: FirebaseAuth
private lateinit var database: FirebaseDatabase
private lateinit var myRef: DatabaseReference

private var backPressedTime: Long = 0
private val EXIT_DELAY = 2000L // 2 seconds for double-press confirmation

private var signspeaker = "Sign Speaker"
private var Gender = "male"

class SignUp_page : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sign_up_page)

        binding = ActivitySignUpPageBinding.inflate(layoutInflater)
        setContentView(binding.root)



        firebaseauth = FirebaseAuth.getInstance()
        database = FirebaseDatabase.getInstance()
        myRef = database.getReference("User")

        val birthdayEditText: EditText = binding.birthdateEdt
        birthdayEditText.setOnClickListener {
            showDatePickerDialog(birthdayEditText)
        }


        binding.singupBtn.setOnClickListener {
            val username = binding.usernameEdt.text.toString()
            val email = binding.emailEdt.text.toString()
            val password = binding.passwordEdt.text.toString()
            val confirmpass = binding.confirmPasswordEdt.text.toString()
            val dateofbirth = binding.birthdateEdt.text.toString()
            val phonenumber = binding.phoneEdt.text.toString()
            val male = binding.radioMale
            val female = binding.radioFemale
            val signlanguagespeaker = binding.deafNormalUser

            if(username.isNotEmpty() && email.isNotEmpty() && password.isNotEmpty() && confirmpass.isNotEmpty() && phonenumber.isNotEmpty()){
                if(password == confirmpass){
                    firebaseauth.createUserWithEmailAndPassword(email,password ).addOnCompleteListener{
                        if(it.isSuccessful){

                            val intent = Intent(this , Translate_page::class.java)
                            //intent.putExtra("username", username)
                            //intent.putExtra("phonenumber", phonenumber)

                            Toast.makeText(this, "user successfully singup",Toast.LENGTH_SHORT).show()
                            startActivity(intent)
                        }else{
                            Toast.makeText(this, it.exception.toString(),Toast.LENGTH_SHORT).show()
                        }
                    }

                    if(signlanguagespeaker.isChecked){
                        signspeaker = "Sign Speaker"
                    }else{
                        signspeaker = "not sign speaker"
                    }
                    if(male.isChecked){
                        Gender = "Male"
                    }else if (female.isChecked){
                        Gender="Female"
                    }
                    else{
                        Gender = "no Gender"
                    }
                    val user = User(username ,email , dateofbirth , phonenumber, Gender , signspeaker)
                    myRef.child(user.username).setValue(user)
                }
                else{Toast.makeText(this, "password does not matched",Toast.LENGTH_SHORT).show()
                }
            }
            else if (username.isEmpty()){
                Toast.makeText(this, "UserName field can not be empty!",Toast.LENGTH_SHORT).show()
                binding.usernameEdt.setBackgroundResource(R.drawable.edittext_error_background)
            }
            else if (email.isEmpty()){
                Toast.makeText(this, "Email field can not be empty!",Toast.LENGTH_SHORT).show()
                binding.emailEdt.setBackgroundResource(R.drawable.edittext_error_background)
            }
            else if (password.isEmpty()){
                Toast.makeText(this, "UserName field can not be empty!",Toast.LENGTH_SHORT).show()
                binding.passwordEdt.setBackgroundResource(R.drawable.edittext_error_background)
            }
            else if (confirmpass.isEmpty()){
                Toast.makeText(this, "UserName field can not be empty!",Toast.LENGTH_SHORT).show()
                binding.confirmPasswordEdt.setBackgroundResource(R.drawable.edittext_error_background)
            }
            else {
                Toast.makeText(this, "Phone Number field can not be empty!",Toast.LENGTH_SHORT).show()
                binding.phoneEdt.setBackgroundResource(R.drawable.edittext_error_background)
            }

        }


        binding.signinClickableTxt.setOnClickListener {
            val intent = Intent(this, Login::class.java)
            startActivity(intent)
        }
    }

    private fun showDatePickerDialog(editText: EditText) {
        val calendar = Calendar.getInstance()
        val year = calendar.get(Calendar.YEAR)
        val month = calendar.get(Calendar.MONTH)
        val day = calendar.get(Calendar.DAY_OF_MONTH)

        val datePickerDialog = DatePickerDialog(this, { _, selectedYear, selectedMonth, selectedDay ->
            val formattedDate = "${selectedDay}/${selectedMonth + 1}/${selectedYear}"
            editText.setText(formattedDate)
        }, year, month, day)

        datePickerDialog.show()
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
