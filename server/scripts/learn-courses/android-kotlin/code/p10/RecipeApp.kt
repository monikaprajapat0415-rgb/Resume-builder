package com.example.recipes

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

// This one annotation makes Hilt build its dependency graph when the app starts.
// Register the class in AndroidManifest.xml:  <application android:name=".RecipeApp" ...>
@HiltAndroidApp
class RecipeApp : Application()
