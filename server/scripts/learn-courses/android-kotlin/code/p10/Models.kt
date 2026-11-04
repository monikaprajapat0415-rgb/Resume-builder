package com.example.recipes

import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonPrimitive

// What the API sends. TheMealDB uses strIngredient1..strIngredient20, so we read each meal as a JsonObject.
@Serializable
data class MealsResponse(val meals: List<JsonObject>? = null)

// What the app uses everywhere else.
data class Recipe(
    val id: String,
    val name: String,
    val thumb: String,
    val category: String,
    val area: String,
    val instructions: String,
    val ingredients: List<String>
)

private fun JsonObject.str(key: String): String? = this[key]?.jsonPrimitive?.contentOrNull?.trim()?.takeIf { it.isNotEmpty() }

fun JsonObject.toRecipe(): Recipe = Recipe(
    id = str("idMeal") ?: "",
    name = str("strMeal") ?: "Unnamed recipe",
    thumb = str("strMealThumb") ?: "",
    category = str("strCategory") ?: "",
    area = str("strArea") ?: "",
    instructions = str("strInstructions") ?: "",
    ingredients = (1..20).mapNotNull { i ->
        val ingredient = str("strIngredient$i") ?: return@mapNotNull null
        listOfNotNull(str("strMeasure$i"), ingredient).joinToString(" ")
    }
)

// A small copy of a recipe, saved on the phone when the user taps the heart.
@Entity(tableName = "favourites")
data class Favourite(@PrimaryKey val id: String, val name: String, val thumb: String, val category: String)
