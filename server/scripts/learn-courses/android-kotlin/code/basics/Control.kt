fun grade(score: Int): String = when {
    score >= 90 -> "A"
    score >= 75 -> "B"
    score >= 50 -> "C"
    else -> "Try again"
}

fun main() {
    for (i in 1..3) println("Round $i")

    var countdown = 3
    while (countdown > 0) {
        print("$countdown ")
        countdown--
    }
    println("Go!")

    val score = 82
    val label = if (score >= 50) "pass" else "fail"   // if is an expression
    println("$score is a $label, grade ${grade(score)}")
}
