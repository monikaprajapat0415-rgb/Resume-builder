fun main() {
    val name = "Asha"          // val: cannot be reassigned
    var steps = 4200           // var: can change
    steps += 800

    val goal: Int = 10_000     // the type can be written out
    val ratio = steps.toDouble() / goal
    val percent = (ratio * 100).toInt()

    println("$name walked $steps steps")
    println("That is $percent% of the goal")
    println("Steps left: ${goal - steps}")
}
