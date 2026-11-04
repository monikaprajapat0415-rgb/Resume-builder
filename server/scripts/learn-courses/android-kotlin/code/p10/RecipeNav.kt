package com.example.recipes

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import coil.compose.AsyncImage

@Composable
fun RecipeNav() {
    val nav = rememberNavController()
    val route = nav.currentBackStackEntryAsState().value?.destination?.route
    Scaffold(bottomBar = {
        if (route == "search" || route == "favourites") NavigationBar {
            NavigationBarItem(route == "search", { nav.navigate("search") { launchSingleTop = true } }, { Icon(Icons.Default.Search, null) }, label = { Text("Search") })
            NavigationBarItem(route == "favourites", { nav.navigate("favourites") { launchSingleTop = true } }, { Icon(Icons.Default.Favorite, null) }, label = { Text("Saved") })
        }
    }) { padding ->
        NavHost(nav, startDestination = "search", modifier = Modifier.padding(padding)) {
            composable("search") { SearchScreen(onOpen = { nav.navigate("detail/$it") }) }
            composable("favourites") { FavouritesScreen(onOpen = { nav.navigate("detail/$it") }) }
            composable("detail/{id}") { DetailScreen(onBack = { nav.popBackStack() }) }
        }
    }
}

@Composable
private fun RecipeRow(name: String, subtitle: String, thumb: String, onClick: () -> Unit) {
    Row(Modifier.fillMaxWidth().clickable(onClick = onClick).padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
        AsyncImage(thumb, null, Modifier.size(72.dp).clip(MaterialTheme.shapes.medium), contentScale = ContentScale.Crop)
        Spacer(Modifier.width(12.dp))
        Column { Text(name, style = MaterialTheme.typography.titleMedium); Text(subtitle, style = MaterialTheme.typography.bodySmall) }
    }
}

@Composable
private fun SearchScreen(vm: SearchViewModel = hiltViewModel(), onOpen: (String) -> Unit) {
    val state by vm.state.collectAsStateWithLifecycle()
    var text by remember { mutableStateOf("") }
    Column(Modifier.fillMaxSize().systemBarsPadding().padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(text, { text = it }, label = { Text("Find a recipe") }, singleLine = true, modifier = Modifier.weight(1f))
            Spacer(Modifier.width(8.dp))
            Button(onClick = { vm.search(text) }) { Text("Go") }
        }
        Spacer(Modifier.height(8.dp))
        if (state.loading) CircularProgressIndicator()
        state.message?.let { Text(it) }
        LazyColumn {
            items(state.results, key = { it.id }) { r -> RecipeRow(r.name, "${r.category} · ${r.area}", r.thumb) { onOpen(r.id) } }
        }
    }
}

@Composable
private fun FavouritesScreen(vm: FavouritesViewModel = hiltViewModel(), onOpen: (String) -> Unit) {
    val favourites by vm.favourites.collectAsStateWithLifecycle()
    Column(Modifier.fillMaxSize().systemBarsPadding().padding(16.dp)) {
        Text("Saved recipes", style = MaterialTheme.typography.headlineSmall)
        if (favourites.isEmpty()) Text("Tap the heart on a recipe to save it here.", Modifier.padding(top = 12.dp))
        LazyColumn { items(favourites, key = { it.id }) { f -> RecipeRow(f.name, f.category, f.thumb) { onOpen(f.id) } } }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun DetailScreen(vm: DetailViewModel = hiltViewModel(), onBack: () -> Unit) {
    val state by vm.state.collectAsStateWithLifecycle()
    val favourite by vm.isFavourite.collectAsStateWithLifecycle()
    Scaffold(topBar = {
        TopAppBar(
            title = { Text(state.recipe?.name ?: "Recipe") },
            navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back") } },
            actions = {
                if (state.recipe != null) IconButton(onClick = vm::toggleFavourite) {
                    Icon(if (favourite) Icons.Default.Favorite else Icons.Default.FavoriteBorder, if (favourite) "Remove from saved" else "Save recipe")
                }
            }
        )
    }) { padding ->
        val r = state.recipe
        when {
            state.loading -> Box(Modifier.padding(padding).fillMaxSize(), Alignment.Center) { CircularProgressIndicator() }
            r == null -> Text(state.error ?: "Nothing to show.", Modifier.padding(padding).padding(16.dp))
            else -> LazyColumn(Modifier.padding(padding).padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                item { AsyncImage(r.thumb, null, Modifier.fillMaxWidth().height(220.dp).clip(MaterialTheme.shapes.medium), contentScale = ContentScale.Crop) }
                item { Text("${r.category} · ${r.area}", style = MaterialTheme.typography.labelLarge) }
                item { Text("Ingredients", style = MaterialTheme.typography.titleMedium) }
                items(r.ingredients) { Text("• $it") }
                item { Text("Method", style = MaterialTheme.typography.titleMedium) }
                item { Text(r.instructions) }
            }
        }
    }
}
