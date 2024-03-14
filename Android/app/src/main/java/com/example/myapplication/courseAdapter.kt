package com.example.myapplication

import android.app.Activity
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.TextView

class courseAdapter(private var activity: Activity ,private var items:ArrayList<course>):
    BaseAdapter() {
    private class ViewHolder(row: View?) {
        var course_title: TextView? = null
        var course_description: TextView? = null

        init {
            this.course_title = row?.findViewById<TextView>(R.id.course_title)
            this.course_description = row?.findViewById<TextView>(R.id.course_description)
        }
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view: View?
        val viewHolder: ViewHolder
        if (convertView == null) {
            val inflater = activity?.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
            view = inflater.inflate(R.layout.courses_adapter, null)
            viewHolder = ViewHolder(view)
            view?.tag = viewHolder
        } else {
            view = convertView
            viewHolder = view.tag as ViewHolder
        }

        var course = items[position]
        viewHolder.course_title?.text = course.title
        viewHolder.course_description?.text = course.description

        return view as View
    }

    override fun getItem(i: Int): course {
        return items[i]
    }

    override fun getItemId(i: Int): Long {
        return i.toLong()
    }

    override fun getCount(): Int {
        return items.size
    }
}