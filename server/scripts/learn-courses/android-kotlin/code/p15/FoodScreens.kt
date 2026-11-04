package com.example.food

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.MarkerState
import com.google.maps.android.compose.rememberCameraPositionState

@Composable
fun FoodApp(vm: FoodViewModel) {
    val state by vm.state.collectAsState()
    var restaurant by remember { mutableStateOf<Restaurant?>(null) }

    when {
        state.status != null -> TrackingScreen(state.status!!, restaurant ?: FoodData.restaurants.first())
        restaurant == null -> RestaurantList { restaurant = it }
        else -> MenuScreen(restaurant!!, state, vm, onBack = { restaurant = null })
    }
}

@Composable
private fun RestaurantList(onPick: (Restaurant) -> Unit) {
    LazyColumn(Modifier.fillMaxSize().padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        item { Text("Restaurants near you", style = MaterialTheme.typography.headlineSmall) }
        items(FoodData.restaurants, key = { it.id }) { r ->
            Card(Modifier.fillMaxWidth().clickable { onPick(r) }) {
                Column(Modifier.padding(16.dp)) {
                    Text(r.name, style = MaterialTheme.typography.titleMedium)
                    Text(r.cuisine)
                }
            }
        }
    }
}

@Composable
private fun MenuScreen(r: Restaurant, state: FoodState, vm: FoodViewModel, onBack: () -> Unit) {
    Column(Modifier.fillMaxSize().padding(12.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            OutlinedButton(onClick = onBack) { Text("Back") }
            Text(r.name, style = MaterialTheme.typography.titleLarge, modifier = Modifier.padding(start = 12.dp))
        }
        LazyColumn(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(FoodData.dishesOf(r.id), key = { it.id }) { dish ->
                Card {
                    Row(Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                        Column(Modifier.weight(1f)) {
                            Text(dish.name)
                            Text(dish.priceCents.rupees())
                        }
                        OutlinedButton(onClick = { vm.remove(dish) }) { Text("-") }
                        Text((state.cart[dish.id] ?: 0).toString(), Modifier.padding(horizontal = 8.dp))
                        OutlinedButton(onClick = { vm.add(dish) }) { Text("+") }
                    }
                }
            }
        }
        Text("Total: " + state.totalCents().rupees(), Modifier.padding(vertical = 8.dp))
        Button(onClick = vm::placeOrder, enabled = state.cart.isNotEmpty(), modifier = Modifier.fillMaxWidth()) {
            Text("Place demo order")
        }
    }
}

@Composable
private fun TrackingScreen(status: OrderStatus, r: Restaurant) {
    val home = Pair(r.lat + 0.01, r.lng + 0.01)
    val fraction = when (status) {
        OrderStatus.Placed, OrderStatus.Preparing -> 0f
        OrderStatus.OnTheWay -> 0.5f
        OrderStatus.Delivered -> 1f
    }
    val courier = courierPosition(Pair(r.lat, r.lng), home, fraction)
    val camera = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(LatLng(r.lat, r.lng), 14f)
    }
    Column(Modifier.fillMaxSize()) {
        Text(status.label, style = MaterialTheme.typography.headlineSmall, modifier = Modifier.padding(16.dp))
        LinearProgressIndicator(
            progress = { (status.ordinal + 1) / OrderStatus.entries.size.toFloat() },
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
        )
        // Needs a Google Maps API key in the manifest. Without one the map stays blank.
        GoogleMap(modifier = Modifier.fillMaxWidth().height(360.dp).padding(top = 16.dp), cameraPositionState = camera) {
            Marker(state = MarkerState(LatLng(r.lat, r.lng)), title = r.name)
            Marker(state = MarkerState(LatLng(home.first, home.second)), title = "You")
            Marker(state = MarkerState(LatLng(courier.first, courier.second)), title = "Courier")
        }
    }
}
