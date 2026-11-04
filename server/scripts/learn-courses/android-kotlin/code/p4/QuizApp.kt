package com.example.quiz

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument

@Composable
fun QuizApp() {
    val nav = rememberNavController()
    NavHost(navController = nav, startDestination = "home") {
        composable("home") {
            HomeScreen(onStart = { nav.navigate("quiz") })
        }
        composable("quiz") {
            QuizScreen(onFinished = { score ->
                // Put the score in the route, and drop the quiz screen from the back stack.
                nav.navigate("result/$score/${questions.size}") { popUpTo("home") }
            })
        }
        composable(
            route = "result/{score}/{total}",
            arguments = listOf(
                navArgument("score") { type = NavType.IntType },
                navArgument("total") { type = NavType.IntType }
            )
        ) { entry ->
            val score = entry.arguments?.getInt("score") ?: 0
            val total = entry.arguments?.getInt("total") ?: 0
            ResultScreen(score, total, onAgain = { nav.navigate("quiz") { popUpTo("home") } })
        }
    }
}

@Composable
fun HomeScreen(onStart: () -> Unit) {
    Column(
        Modifier.fillMaxSize().systemBarsPadding().padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Android Quiz", style = MaterialTheme.typography.displaySmall)
        Spacer(Modifier.height(8.dp))
        Text("${questions.size} questions. Pick one answer for each.")
        Spacer(Modifier.height(24.dp))
        Button(onClick = onStart) { Text("Start") }
    }
}

@Composable
fun QuizScreen(onFinished: (Int) -> Unit) {
    // rememberSaveable survives screen rotation; plain remember does not.
    var index by rememberSaveable { mutableIntStateOf(0) }
    var score by rememberSaveable { mutableIntStateOf(0) }
    var picked by rememberSaveable { mutableStateOf<Int?>(null) }

    val q = questions[index]
    Column(Modifier.fillMaxSize().systemBarsPadding().padding(24.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        LinearProgressIndicator(progress = { (index + 1) / questions.size.toFloat() }, modifier = Modifier.fillMaxWidth())
        Text("Question ${index + 1} of ${questions.size}")
        Text(q.text, style = MaterialTheme.typography.titleLarge)

        q.options.forEachIndexed { i, option ->
            val colors = when {
                picked == null -> ButtonDefaults.outlinedButtonColors()
                i == q.answerIndex -> ButtonDefaults.outlinedButtonColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
                i == picked -> ButtonDefaults.outlinedButtonColors(containerColor = MaterialTheme.colorScheme.errorContainer)
                else -> ButtonDefaults.outlinedButtonColors()
            }
            OutlinedButton(
                onClick = { if (picked == null) { picked = i; if (i == q.answerIndex) score++ } },
                colors = colors,
                modifier = Modifier.fillMaxWidth()
            ) { Text(option) }
        }

        Spacer(Modifier.weight(1f))
        Button(
            onClick = {
                if (index == questions.lastIndex) onFinished(score) else { index++; picked = null }
            },
            enabled = picked != null,
            modifier = Modifier.fillMaxWidth()
        ) { Text(if (index == questions.lastIndex) "See result" else "Next") }
    }
}

@Composable
fun ResultScreen(score: Int, total: Int, onAgain: () -> Unit) {
    Column(
        Modifier.fillMaxSize().systemBarsPadding().padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("You scored", style = MaterialTheme.typography.titleMedium)
        Text("$score / $total", style = MaterialTheme.typography.displayLarge)
        Spacer(Modifier.height(24.dp))
        Button(onClick = onAgain) { Text("Try again") }
    }
}
