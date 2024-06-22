package com.example.signlanguagetranslator

import android.net.Uri
import android.os.Bundle
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import android.widget.VideoView
import androidx.appcompat.app.AppCompatActivity

private var backPressedTime: Long = 0
private val EXIT_DELAY = 2000L // 2 seconds for double-press confirmation

class Course1 : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_course1)
        val listView: ListView = findViewById(R.id.course_lessons)

        val videoView: VideoView = findViewById(R.id.videoView)



        val videoPath2 = "android.resource://" + packageName + "/raw/kids_arsl_1"
        val uri = Uri.parse(videoPath2)
        videoView.setVideoURI(uri)


        // Set up media controller for play, pause, etc. (optional)
        val mediaController = CustomMediaController(this)
        mediaController.setAnchorView(videoView)
        videoView.setMediaController(mediaController)

        // Start playing the video
        videoView.start()


        val lessons = listOf(
            CourseLesson(1, "Stop ", "Video - 35 second"),
            CourseLesson(2, "Notice ", "Video - 35 second"),
            CourseLesson(3, "Think ", "Video - 35 second"),
            CourseLesson(4, "Respect ", "Video - 35 second"),
            CourseLesson(5, "Are you okay? ", "Video - 35 second"),
            CourseLesson(6, "Good evening", "Video - 35 second"),
            CourseLesson(7, "Hello ", "Video - 35 second"),
            CourseLesson(8, "How are you?", "Video - 35 second"),
            CourseLesson(9, "Thank you", "Video - 35 second"),
            CourseLesson(10, "What's your name?", "Video - 35 second"),
            CourseLesson(11, "Encouragement ", "Video - 35 second"),
            CourseLesson(12, "Tolerance ", "Video - 35 second"),
            CourseLesson(13, "Kindness towards others", "Video - 35 second"),
            CourseLesson(14, "Kindness to oneself  ", "Video - 35 second"),
            CourseLesson(15, "Self-confidence ", "Video - 35 second"),
            CourseLesson(16, "Self-forgiveness ", "Video - 35 second"),
            CourseLesson(17, "Frustration  ", "Video - 35 second"),
            CourseLesson(18, "Sadness ", "Video - 35 second"),
            CourseLesson(19, "Jealousy  ", "Video - 35 second"),
            CourseLesson(20, "Interest ", "Video - 35 second"),
            CourseLesson(21, "Fear ", "Video - 35 second"),
            CourseLesson(22, "Tension ", "Video - 35 second"),
            CourseLesson(23, "Determination  ", "Video - 35 second"),
            // Add more lessons as needed
        )

        val adapter = CourseLessonAdapter(this, lessons)
        listView.adapter = adapter


        listView.setOnItemClickListener { _, _, position, _ ->
            val selectedItem = position + 1
            val videoFileName = "kids_arsl_$selectedItem"
            //Toast.makeText(this, "Clicked on: $selectedItem", Toast.LENGTH_SHORT).show()


            val videoPath = "android.resource://" + packageName + "/raw/$videoFileName"
            val uri = Uri.parse(videoPath)



            videoView.setVideoURI(uri)
        }

        val lecturesTextView = findViewById<TextView>(R.id.lecturesTextView)
        val moreTextView = findViewById<TextView>(R.id.moreTextView)

        lecturesTextView.setOnClickListener {
            selectTextView(lecturesTextView, moreTextView)
        }

        moreTextView.setOnClickListener {
            selectTextView(moreTextView, lecturesTextView)

        }
    }

    override fun onBackPressed() {
        if (System.currentTimeMillis() - backPressedTime < EXIT_DELAY) {
            super.onBackPressed()
        } else {
            backPressedTime = System.currentTimeMillis()
            Toast.makeText(this, "Press back again to exit", Toast.LENGTH_SHORT).show()
        }
    }

    private fun selectTextView(selectedTextView: TextView, unselectedTextView: TextView) {
        selectedTextView.isSelected = true
        unselectedTextView.isSelected = false

        // Clear selection after a delay
        selectedTextView.postDelayed({
            selectedTextView.isSelected = false
        }, 700)
    }
}
