package com.example.posts

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory

data class PostsState(
    val loading: Boolean = false,
    val refreshing: Boolean = false,
    val posts: List<Post> = emptyList(),
    val error: String? = null
)

class PostViewModel : ViewModel() {
    private val api: PostApi = Retrofit.Builder()
        .baseUrl("https://jsonplaceholder.typicode.com/")
        .addConverterFactory(Json { ignoreUnknownKeys = true }.asConverterFactory("application/json".toMediaType()))
        .build()
        .create(PostApi::class.java)

    private val _state = MutableStateFlow(PostsState(loading = true))
    private val _query = MutableStateFlow("")
    val query = _query.asStateFlow()

    // What the screen shows: the loaded posts filtered by the search text.
    val visible: StateFlow<PostsState> = combine(_state, _query) { s, q ->
        if (q.isBlank()) s else s.copy(posts = s.posts.filter { it.title.contains(q, ignoreCase = true) })
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), PostsState(loading = true))

    init { load(first = true) }

    fun setQuery(text: String) { _query.value = text }

    fun load(first: Boolean = false) {
        _state.update { it.copy(loading = first, refreshing = !first, error = null) }
        viewModelScope.launch {
            try {
                val list = api.posts()
                _state.update { it.copy(loading = false, refreshing = false, posts = list) }
            } catch (e: Exception) {
                _state.update { it.copy(loading = false, refreshing = false, error = "Could not load posts. Pull down to try again.") }
            }
        }
    }

    suspend fun find(id: Int): Post? =
        _state.value.posts.firstOrNull { it.id == id } ?: runCatching { api.post(id) }.getOrNull()
}
