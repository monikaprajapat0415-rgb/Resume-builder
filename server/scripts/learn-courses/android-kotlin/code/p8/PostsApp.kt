package com.example.posts

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import coil.compose.AsyncImage

@Composable
fun PostsApp(vm: PostViewModel = viewModel()) {
    val nav = rememberNavController()
    NavHost(nav, startDestination = "list") {
        composable("list") { ListScreen(vm, onOpen = { nav.navigate("detail/$it") }) }
        composable("detail/{id}", arguments = listOf(navArgument("id") { type = NavType.IntType })) { entry ->
            DetailScreen(vm, entry.arguments?.getInt("id") ?: 0, onBack = { nav.popBackStack() })
        }
    }
}

// Free random pictures. The same seed always gives the same picture, so each post keeps its image.
private fun imageFor(id: Int) = "https://picsum.photos/seed/post$id/400/240"

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ListScreen(vm: PostViewModel, onOpen: (Int) -> Unit) {
    val state by vm.visible.collectAsStateWithLifecycle()
    val query by vm.query.collectAsStateWithLifecycle()

    Scaffold(topBar = { TopAppBar(title = { Text("Posts") }) }) { padding ->
        Column(Modifier.padding(padding).padding(horizontal = 12.dp)) {
            OutlinedTextField(query, vm::setQuery, label = { Text("Search titles") }, singleLine = true, modifier = Modifier.fillMaxWidth())
            when {
                state.loading -> Box(Modifier.fillMaxSize(), Alignment.Center) { CircularProgressIndicator() }
                else -> PullToRefreshBox(isRefreshing = state.refreshing, onRefresh = { vm.load() }, modifier = Modifier.fillMaxSize()) {
                    LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxSize()) {
                        state.error?.let { item { Text(it, color = MaterialTheme.colorScheme.error) } }
                        if (state.posts.isEmpty() && state.error == null) item { Text("No posts match.") }
                        items(state.posts, key = { it.id }) { post ->
                            Card(Modifier.fillMaxWidth().clickable { onOpen(post.id) }) {
                                AsyncImage(
                                    model = imageFor(post.id), contentDescription = null, contentScale = ContentScale.Crop,
                                    modifier = Modifier.fillMaxWidth().height(140.dp)
                                )
                                Column(Modifier.padding(12.dp)) {
                                    Text(post.title, style = MaterialTheme.typography.titleMedium, maxLines = 2, overflow = TextOverflow.Ellipsis)
                                    Text(post.body, maxLines = 2, overflow = TextOverflow.Ellipsis, style = MaterialTheme.typography.bodySmall)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun DetailScreen(vm: PostViewModel, id: Int, onBack: () -> Unit) {
    // produceState runs the suspend call once for this id and exposes the result as State.
    val post by produceState<Post?>(initialValue = null, id) { value = vm.find(id) }
    Scaffold(topBar = {
        TopAppBar(title = { Text("Post $id") }, navigationIcon = {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back") }
        })
    }) { padding ->
        val p = post
        if (p == null) Box(Modifier.padding(padding).fillMaxSize(), Alignment.Center) { CircularProgressIndicator() }
        else Column(Modifier.padding(padding).padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            AsyncImage(imageFor(p.id), null, Modifier.fillMaxWidth().height(200.dp).clip(MaterialTheme.shapes.medium), contentScale = ContentScale.Crop)
            Text(p.title, style = MaterialTheme.typography.headlineSmall)
            Text(p.body)
        }
    }
}
