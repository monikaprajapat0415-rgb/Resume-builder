package com.example.converter

/** Every unit knows how to turn itself into a base unit and back. */
data class UnitDef(val name: String, val toBase: (Double) -> Double, val fromBase: (Double) -> Double)

data class Category(val name: String, val units: List<UnitDef>)

private fun linear(name: String, factor: Double) = UnitDef(name, { it * factor }, { it / factor })

val categories = listOf(
    Category(
        "Length (base: metre)",
        listOf(linear("Metre", 1.0), linear("Kilometre", 1000.0), linear("Centimetre", 0.01),
            linear("Mile", 1609.344), linear("Foot", 0.3048), linear("Inch", 0.0254))
    ),
    Category(
        "Weight (base: kilogram)",
        listOf(linear("Kilogram", 1.0), linear("Gram", 0.001), linear("Pound", 0.45359237), linear("Ounce", 0.028349523125))
    ),
    Category(
        "Temperature (base: Celsius)",
        listOf(
            UnitDef("Celsius", { it }, { it }),
            UnitDef("Fahrenheit", { (it - 32) * 5 / 9 }, { it * 9 / 5 + 32 }),
            UnitDef("Kelvin", { it - 273.15 }, { it + 273.15 })
        )
    )
)

fun convert(value: Double, from: UnitDef, to: UnitDef): Double = to.fromBase(from.toBase(value))
