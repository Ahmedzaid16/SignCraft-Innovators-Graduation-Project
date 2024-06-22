package com.example.signlanguagetranslator

import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ListView
import android.widget.Toast
import android.widget.VideoView

private var backPressedTime: Long = 0
private val EXIT_DELAY = 2000L // 2 seconds for double-press confirmation

class Course2 : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_course2)
        val listView: ListView = findViewById(R.id.course_lessons)

        val videoView: VideoView = findViewById(R.id.videoView)



        val videoPath = "android.resource://" + packageName + "/raw/arsi_with_caption_1"
        val uri = Uri.parse(videoPath)
        videoView.setVideoURI(uri)


        // Set up media controller for play, pause, etc. (optional)
        val mediaController = CustomMediaController(this)
        mediaController.setAnchorView(videoView)
        videoView.setMediaController(mediaController)

        // Start playing the video
        videoView.start()


        val lessons = listOf(
            CourseLesson(
                1,
                "الحروف",
                "الحروف الابجدية بلغة الاشاره العربيه | The letters in Arabic Sign Language"
            ),
            CourseLesson(
                2,
                "الاحساس",
                "الاحساس بلغة الاشاره العربيه | The feeling is in Arabic Sign Language"
            ),
            CourseLesson(
                3,
                "الاعداد",
                "الاعداد بلغه الاشاره العربيه | The numbers are in Arabic Sign Language"
            ),
            CourseLesson(
                4,
                "الالوان",
                "الالوان بلغه الاشاره العربيه | The colors are in Arabic Sign Language"
            ),
            CourseLesson(
                5,
                "الصلاه",
                "الصلاه بلغه الاشاره العربيه | Prayer in Arabic Sign Language"
            ),
            CourseLesson(
                6,
                "المستشفى ",
                "المستشفى بلغه الاشاره العربيه | The hospital is in Arabic Sign Language"
            ),
            CourseLesson(
                7,
                "الوجبات السريعه",
                "الوجبات السريعه بلغه الاشاره العربيه | Fast food in Arabic Sign Language"
            ),
            CourseLesson(
                8,
                "العملات",
                "العملات بلغه الاشاره العربيه | Currencies in Arabic Sign Language"
            ),
            CourseLesson(
                9,
                "العائلة",
                "العائله بلغه الاشاره العربيه | The family in Arabic Sign Language"
            )

        )


        val adapter = CourseLessonAdapter(this, lessons)
        listView.adapter = adapter

        listView.setOnItemClickListener { _, _, position, _ ->
            val selectedItem = position + 1
            val videoFileName = "arsi_with_caption_$selectedItem"
            //Toast.makeText(this, "Clicked on: $selectedItem", Toast.LENGTH_SHORT).show()

            //Set the video path (replace 'sample' with your video file name)
            val videoPath = "android.resource://" + packageName + "/raw/$videoFileName"
            val uri = Uri.parse(videoPath)



            videoView.setVideoURI(uri)
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
}