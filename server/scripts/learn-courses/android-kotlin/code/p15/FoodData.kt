package com.example.food

data class Dish(val id: Int, val name: String, val priceCents: Long, val restaurantId: Int)

data class Restaurant(
    val id: Int,
    val name: String,
    val cuisine: String,
    val lat: Double,
    val lng: Double,
)

// Sample data for the project. A real app loads this from your server.
object FoodData {
    val restaurants = listOf(
        Restaurant(1, "Spice Corner", "Indian", 28.6139, 77.2090),
        Restaurant(2, "Pasta Place", "Italian", 28.6200, 77.2150),
        Restaurant(3, "Green Bowl", "Healthy", 28.6100, 77.2000),
    )
    val dishes = listOf(
        Dish(1, "Paneer Tikka", 24900, 1),
        Dish(2, "Dal Makhani", 21900, 1),
        Dish(3, "Margherita Pizza", 29900, 2),
        Dish(4, "Penne Arrabbiata", 26900, 2),
        Dish(5, "Quinoa Salad", 22900, 3),
        Dish(6, "Fruit Smoothie", 14900, 3),
    )

    fun dishesOf(restaurantId: Int) = dishes.filter { it.restaurantId == restaurantId }
}

enum class OrderStatus(val label: String) {
    Placed("Order placed"),
    Preparing("Preparing your food"),
    OnTheWay("On the way"),
    Delivered("Delivered"),
}
