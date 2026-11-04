package com.example.food

import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

// Pretends to be the server pushing order updates.
// A real app listens to a WebSocket, Firestore document or push messages instead.
class OrderTracker {
    fun track(): Flow<OrderStatus> = flow {
        for (status in OrderStatus.entries) {
            emit(status)
            delay(3000)
        }
    }
}

// The courier moves in a straight line from the restaurant to the customer.
fun courierPosition(from: Pair<Double, Double>, to: Pair<Double, Double>, fraction: Float): Pair<Double, Double> {
    val f = fraction.coerceIn(0f, 1f)
    return Pair(from.first + (to.first - from.first) * f, from.second + (to.second - from.second) * f)
}
