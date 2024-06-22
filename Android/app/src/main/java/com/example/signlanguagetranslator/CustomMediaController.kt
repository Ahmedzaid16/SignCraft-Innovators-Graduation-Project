package com.example.signlanguagetranslator

import android.content.Context
import android.widget.FrameLayout
import android.widget.MediaController

class CustomMediaController(context: Context) : MediaController(context) {

    override fun setAnchorView(view: android.view.View?) {
        super.setAnchorView(view)
        // Customize the layout parameters to position the MediaController on the video
        val params = layoutParams as FrameLayout.LayoutParams
        params.gravity = android.view.Gravity.TOP
        params.height = 100 // Set the desired height
        //params.topMargin = 50 // Adjust the top margin as needed
        params.bottomMargin = 1625 // Adjust the left margin as needed
        layoutParams = params
    }
}
