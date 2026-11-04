// A data class gives you equals, toString and copy for free.
data class Product(val name: String, val price: Double, val stock: Int)

open class Account(val owner: String, balance: Double) {
    var balance: Double = balance
        private set                       // others can read it but not change it directly

    fun deposit(amount: Double) {
        require(amount > 0) { "Deposit must be positive" }
        balance += amount
    }

    open fun describe() = "$owner has $balance"
}

class SavingsAccount(owner: String, balance: Double, private val rate: Double) : Account(owner, balance) {
    override fun describe() = "${super.describe()} (interest rate ${rate * 100}%)"
}

interface Shape {
    fun area(): Double
}
class Square(private val side: Double) : Shape {
    override fun area() = side * side
}

class Circle(private val r: Double) : Shape {
    override fun area() = Math.PI * r * r
}

fun main() {
    val p = Product("Pen", 1.5, 20)
    val cheaper = p.copy(price = 1.2)
    println(p)
    println(cheaper)

    val acc = SavingsAccount("Meera", 100.0, 0.04)
    acc.deposit(50.0)
    println(acc.describe())

    val shapes: List<Shape> = listOf(Square(2.0), Square(3.0))
    println(shapes.sumOf { it.area() })
}
