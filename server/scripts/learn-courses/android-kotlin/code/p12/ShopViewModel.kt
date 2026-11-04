package com.example.shop

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

sealed interface ProductsState {
    data object Loading : ProductsState
    data class Ready(val items: List<ProductDto>) : ProductsState
    data class Failed(val message: String) : ProductsState
}

class ShopViewModel(
    private val api: ShopApi,
    private val cart: CartDao,
) : ViewModel() {

    private val _products = MutableStateFlow<ProductsState>(ProductsState.Loading)
    val products: StateFlow<ProductsState> = _products.asStateFlow()

    val lines: StateFlow<List<CartLine>> = cart.lines()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val totalCents: StateFlow<Long> = cart.lines()
        .map { list -> list.sumOf { it.priceCents * it.quantity } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0L)

    private val _orderPlaced = MutableStateFlow(false)
    val orderPlaced: StateFlow<Boolean> = _orderPlaced.asStateFlow()

    init {
        load()
    }

    fun load() {
        _products.value = ProductsState.Loading
        viewModelScope.launch {
            _products.value = try {
                ProductsState.Ready(api.products())
            } catch (e: Exception) {
                ProductsState.Failed("Could not load products. Check your connection.")
            }
        }
    }

    fun add(p: ProductDto) {
        viewModelScope.launch {
            val existing = cart.find(p.id)
            val line = existing?.copy(quantity = existing.quantity + 1)
                ?: CartLine(p.id, p.title, p.image, Math.round(p.price * 100), 1)
            cart.save(line)
        }
    }

    fun change(line: CartLine, delta: Int) {
        viewModelScope.launch {
            val q = line.quantity + delta
            if (q <= 0) cart.remove(line.productId) else cart.save(line.copy(quantity = q))
        }
    }

    // Demo only. A real app sends the cart to your server, which creates the order
    // and talks to the payment provider.
    fun placeDemoOrder() {
        viewModelScope.launch {
            cart.clear()
            _orderPlaced.value = true
        }
    }

    fun orderSeen() {
        _orderPlaced.value = false
    }
}

fun Long.asMoney(): String {
    val whole = this / 100
    val cents = (this % 100).toString().padStart(2, '0')
    return "$whole.$cents"
}
