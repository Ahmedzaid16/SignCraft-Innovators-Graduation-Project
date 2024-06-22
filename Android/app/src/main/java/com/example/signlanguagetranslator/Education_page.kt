package com.example.signlanguagetranslator

import android.content.Intent
import android.os.Bundle
import android.widget.ListView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.signlanguagetranslator.databinding.ActivityEducationPageBinding

private lateinit var binding: ActivityEducationPageBinding

private var backPressedTime: Long = 0
private val EXIT_DELAY = 2000L // 2 seconds for double-press confirmation

class Education_page : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityEducationPageBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val listview: ListView = binding.playlistListView
        // Create a list of custom items
        val itemList = listOf(
            CustomListItem(
                R.drawable.kids_course,
                "Kids course ",
                "An ideal introduction for children to Egyptian Arabic Sign Language "
            ),
            CustomListItem(
                R.drawable.adult_course2,
                "ArSL With Started with Caption ArESL",
                "A comprehensive initiation into Arabic Sign Language (ArSL)..."
            ),


        )

        // Create and set the custom adapter
        val adapter = CustomListAdapter(this, R.layout.custom_list_item, itemList)
        listview.adapter = adapter




        listview.setOnItemClickListener { _, _, position, _ ->
            // Handle item click, determine the activity based on the position
            val selectedActivity = when (position) {
                0 -> Course1::class.java
                1 -> Course2::class.java
                else -> Education_page::class.java
            }

            val intent = Intent(this, selectedActivity)
            startActivity(intent)
        }



        binding.translateIcon.setOnClickListener {
            val intent = Intent(this, Translate_page::class.java)
            startActivity(intent)
        }
        binding.profileIcon.setOnClickListener {
            val intent = Intent(this, Profile_page::class.java)
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
}