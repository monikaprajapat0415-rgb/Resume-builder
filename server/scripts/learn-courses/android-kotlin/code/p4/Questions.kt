package com.example.quiz

data class Question(val text: String, val options: List<String>, val answerIndex: Int)

val questions = listOf(
    Question("Which language is the main language for Android apps today?", listOf("Kotlin", "COBOL", "Swift"), 0),
    Question("What do you call a function that draws UI in Jetpack Compose?", listOf("A composable", "A servlet", "A layout file"), 0),
    Question("Which keyword makes a value that cannot be reassigned?", listOf("var", "val", "mut"), 1),
    Question("What does the safe-call operator ?. do?", listOf("Stops when the value is null instead of crashing", "Deletes a file", "Starts a coroutine"), 0),
    Question("Which tool turns your code into an installable Android app file?", listOf("Gradle", "Photoshop", "Excel"), 0),
)
