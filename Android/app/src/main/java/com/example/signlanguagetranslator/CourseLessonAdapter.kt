package com.example.signlanguagetranslator

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView

class CourseLessonAdapter(context: Context, private val lessons: List<CourseLesson>) :
    ArrayAdapter<CourseLesson>(context, 0, lessons) {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = convertView ?: LayoutInflater.from(context)
            .inflate(R.layout.custom_list_items_course_videoes, parent, false)

        val lesson = lessons[position]

        val numberTextView = view.findViewById<TextView>(R.id.number_text)
        val titleTextView = view.findViewById<TextView>(R.id.title)
        val descriptionTextView = view.findViewById<TextView>(R.id.description)

        numberTextView.text = lesson.number.toString()
        titleTextView.text = lesson.title
        descriptionTextView.text = lesson.description

        return view
    }
}
