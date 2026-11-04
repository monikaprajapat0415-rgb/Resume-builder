data class Student(val name: String, val marks: Int)

fun main() {
    val students = listOf(Student("Asha", 82), Student("Ben", 45), Student("Chen", 91), Student("Dev", 67))

    val passed = students.filter { it.marks >= 50 }          // keep some items
    val names = passed.map { it.name }                        // change each item
    val best = students.maxByOrNull { it.marks }              // find one
    val average = students.map { it.marks }.average()         // fold into one value

    println(names)
    println(best?.name)
    println(average)
    println(students.sortedByDescending { it.marks }.map { it.name })

    val byResult = students.groupBy { if (it.marks >= 50) "pass" else "fail" }
    println(byResult.mapValues { (_, list) -> list.size })

    val mutable = mutableListOf("a", "b")
    mutable.add("c")
    println(mutable)
}
