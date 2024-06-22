package com.example.signlanguagetranslator

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ImageView
import android.widget.TextView

class CustomListAdapter(context: Context, resource: Int, objects: List<CustomListItem>) :
    ArrayAdapter<CustomListItem>(context, resource, objects) {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        var listItemView = convertView

        if (listItemView == null) {
            listItemView =
                LayoutInflater.from(context).inflate(R.layout.custom_list_item, parent, false)
        }

        val currentItem = getItem(position)

        val imageView: ImageView = listItemView!!.findViewById(R.id.imageView)
        imageView.setImageResource(
            currentItem?.imageResource ?: R.drawable.baseline_sign_language_24
        )

        val textView1: TextView = listItemView.findViewById(R.id.title)
        textView1.text = currentItem?.text1 ?: "Text View 1"

        val textView2: TextView = listItemView.findViewById(R.id.description)
        textView2.text = currentItem?.text2 ?: "Text View 2"

        return listItemView
    }
}
