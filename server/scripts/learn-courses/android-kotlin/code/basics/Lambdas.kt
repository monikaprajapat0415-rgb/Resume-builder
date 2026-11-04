fun repeatAction(times: Int, action: (Int) -> Unit) {
    for (i in 1..times) action(i)
}

fun main() {
    repeatAction(3) { n -> println("Run number $n") }

    val double = { x: Int -> x * 2 }
    println(double(21))

    val words = listOf("kotlin", "android", "compose")
    println(words.map { it.replaceFirstChar { c -> c.uppercase() } })
    println(words.joinToString(" | "))
}
