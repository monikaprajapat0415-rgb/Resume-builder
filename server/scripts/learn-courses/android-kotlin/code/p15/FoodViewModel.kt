package com.example.food

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class FoodState(
    val cart: Map<Int, Int> = emptyMap(),    // dish id to quantity
    val status: OrderStatus? = null,
) {
    fun totalCents(): Long = cart.entries.sumOf { (id, qty) ->
        (FoodData.dishes.firstOrNull { it.id == id }?.priceCents ?: 0L) * qty
    }
}

class FoodViewModel(private val tracker: OrderTracker = OrderTracker()) : ViewModel() {
    private val _state = MutableStateFlow(FoodState())
    val state: StateFlow<FoodState> = _state.asStateFlow()

    fun add(dish: Dish) {
        _state.update { it.copy(cart = it.cart + (dish.id to ((it.cart[dish.id] ?: 0) + 1))) }
    }

    fun remove(dish: Dish) {
        _state.update {
            val q = (it.cart[dish.id] ?: 0) - 1
            it.copy(cart = if (q <= 0) it.cart - dish.id else it.cart + (dish.id to q))
        }
    }

    // Demo checkout: no payment is taken.
    fun placeOrder() {
        if (_state.value.cart.isEmpty()) return
        viewModelScope.launch {
            tracker.track().collect { status ->
                _state.update { it.copy(status = status, cart = if (status == OrderStatus.Placed) emptyMap() else it.cart) }
            }
        }
    }
}

fun Long.rupees(): String {
    return "₹" + (this / 100) + "." + (this % 100).toString().padStart(2, '0')
}
