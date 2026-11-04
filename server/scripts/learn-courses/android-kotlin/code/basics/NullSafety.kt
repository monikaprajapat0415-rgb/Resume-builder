fun lengthOf(text: String?): Int = text?.length ?: 0      // ?. stops at null, ?: gives a default

fun main() {
    var nickname: String? = null
    println(nickname?.uppercase())          // null, no crash
    println(lengthOf(nickname))             // 0

    nickname = "kit"
    println(lengthOf(nickname))             // 3

    nickname?.let { println("Nickname is $it") }   // runs only when not null

    val input = "12a"
    val number = input.toIntOrNull()        // null instead of an exception
    println(number ?: "not a number")
}
