package com.example.recipes

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class SearchState(val loading: Boolean = false, val results: List<Recipe> = emptyList(), val message: String? = "Search for a dish, such as chicken or pasta.")

@HiltViewModel
class SearchViewModel @Inject constructor(private val repo: RecipeRepository) : ViewModel() {
    private val _state = MutableStateFlow(SearchState())
    val state = _state.asStateFlow()

    fun search(text: String) {
        if (text.isBlank()) return
        _state.value = SearchState(loading = true, message = null)
        viewModelScope.launch {
            _state.value = try {
                val list = repo.search(text)
                SearchState(results = list, message = if (list.isEmpty()) "No recipes found for \"$text\"." else null)
            } catch (e: Exception) {
                SearchState(message = "Could not reach the recipe service. Check your connection.")
            }
        }
    }
}

data class DetailState(val loading: Boolean = true, val recipe: Recipe? = null, val error: String? = null)

@HiltViewModel
class DetailViewModel @Inject constructor(private val repo: RecipeRepository, saved: SavedStateHandle) : ViewModel() {
    private val id: String = checkNotNull(saved["id"])   // filled in from the navigation route "detail/{id}"

    private val _state = MutableStateFlow(DetailState())
    val state = _state.asStateFlow()
    val isFavourite = repo.isFavourite(id).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), false)

    init {
        viewModelScope.launch {
            _state.value = try {
                repo.recipe(id)?.let { DetailState(false, it) } ?: DetailState(false, error = "This recipe was not found.")
            } catch (e: Exception) {
                DetailState(false, error = "Could not load this recipe.")
            }
        }
    }

    fun toggleFavourite() {
        val recipe = _state.value.recipe ?: return
        viewModelScope.launch { repo.toggleFavourite(recipe, isFavourite.value) }
    }
}

@HiltViewModel
class FavouritesViewModel @Inject constructor(repo: RecipeRepository) : ViewModel() {
    val favourites = repo.favourites.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
}
