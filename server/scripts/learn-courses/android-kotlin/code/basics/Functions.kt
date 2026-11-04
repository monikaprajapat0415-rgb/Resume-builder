fun greet(name: String, greeting: String = "Hello"): String = "$greeting, $name!"

fun average(vararg numbers: Int): Double =
    if (numbers.isEmpty()) 0.0 else numbers.sum().toDouble() / numbers.size

fun main() {
    println(greet("Ravi"))
    println(greet("Ravi", greeting = "Welcome"))
    println(average(70, 80, 90))
    println(average())
}
