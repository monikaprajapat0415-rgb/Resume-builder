package com.example.shop

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.ShoppingCart
import coil.compose.AsyncImage

@Composable
fun ShopApp(vm: ShopViewModel) {
    var tab by remember { mutableStateOf(0) }
    val lines by vm.lines.collectAsState()
    val placed by vm.orderPlaced.collectAsState()

    Scaffold(
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = tab == 0,
                    onClick = { tab = 0 },
                    icon = { Icon(Icons.Default.Home, contentDescription = null) },
                    label = { Text("Shop") },
                )
                NavigationBarItem(
                    selected = tab == 1,
                    onClick = { tab = 1 },
                    icon = { Icon(Icons.Default.ShoppingCart, contentDescription = null) },
                    label = { Text("Cart (" + lines.sumOf { it.quantity } + ")") },
                )
            }
        },
    ) { padding ->
        val modifier = Modifier.padding(padding)
        if (tab == 0) {
            ProductGrid(vm, modifier)
        } else {
            CartScreen(vm, placed, modifier)
        }
    }
}

@Composable
private fun ProductGrid(vm: ShopViewModel, modifier: Modifier) {
    val state by vm.products.collectAsState()
    when (val s = state) {
        ProductsState.Loading -> Column(modifier.fillMaxSize(), verticalArrangement = Arrangement.Center, horizontalAlignment = Alignment.CenterHorizontally) {
            CircularProgressIndicator()
        }
        is ProductsState.Failed -> Column(modifier.fillMaxSize(), verticalArrangement = Arrangement.Center, horizontalAlignment = Alignment.CenterHorizontally) {
            Text(s.message)
            Button(onClick = vm::load) { Text("Try again") }
        }
        is ProductsState.Ready -> LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = modifier,
            contentPadding = androidx.compose.foundation.layout.PaddingValues(8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            items(s.items, key = { it.id }) { p ->
                Card {
                    Column(Modifier.padding(8.dp)) {
                        AsyncImage(
                            model = p.image,
                            contentDescription = p.title,
                            contentScale = ContentScale.Fit,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(110.dp),
                        )
                        Text(p.title, maxLines = 2, modifier = Modifier.padding(top = 6.dp))
                        Text("$" + Math.round(p.price * 100).asMoney())
                        Button(onClick = { vm.add(p) }, modifier = Modifier.fillMaxWidth()) {
                            Text("Add to cart")
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CartScreen(vm: ShopViewModel, placed: Boolean, modifier: Modifier) {
    val lines by vm.lines.collectAsState()
    val total by vm.totalCents.collectAsState()

    LaunchedEffect(placed) {
        // keep the confirmation visible until the user adds something new
    }

    Column(modifier.fillMaxSize().padding(12.dp)) {
        if (placed && lines.isEmpty()) {
            Text("Demo order placed. No payment was taken.")
        } else if (lines.isEmpty()) {
            Text("Your cart is empty.")
        }
        LazyColumn(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(lines, key = { it.productId }) { line ->
                Card {
                    Row(Modifier.padding(8.dp), verticalAlignment = Alignment.CenterVertically) {
                        AsyncImage(model = line.image, contentDescription = null, modifier = Modifier.size(48.dp))
                        Column(Modifier.weight(1f).padding(horizontal = 8.dp)) {
                            Text(line.title, maxLines = 2)
                            Text("$" + (line.priceCents * line.quantity).asMoney())
                        }
                        OutlinedButton(onClick = { vm.change(line, -1) }) { Text("-") }
                        Text(line.quantity.toString(), modifier = Modifier.padding(horizontal = 8.dp))
                        OutlinedButton(onClick = { vm.change(line, 1) }) { Text("+") }
                    }
                }
            }
        }
        if (lines.isNotEmpty()) {
            Text("Total: $" + total.asMoney(), modifier = Modifier.padding(vertical = 8.dp))
            Button(onClick = vm::placeDemoOrder, modifier = Modifier.fillMaxWidth()) {
                Text("Place demo order")
            }
        }
    }
}
