package com.example.recipes

import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class RecipeRepository @Inject constructor(
    private val api: MealApi,
    private val dao: FavouriteDao
) {
    suspend fun search(text: String): List<Recipe> =
        api.search(text.trim()).meals.orEmpty().map { it.toRecipe() }

    suspend fun recipe(id: String): Recipe? = api.lookup(id).meals?.firstOrNull()?.toRecipe()

    val favourites: Flow<List<Favourite>> = dao.observeAll()
    fun isFavourite(id: String): Flow<Boolean> = dao.observeIsFavourite(id)

    suspend fun toggleFavourite(recipe: Recipe, currentlyFavourite: Boolean) {
        if (currentlyFavourite) dao.remove(recipe.id)
        else dao.add(Favourite(recipe.id, recipe.name, recipe.thumb, recipe.category))
    }
}
