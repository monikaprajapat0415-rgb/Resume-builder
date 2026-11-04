package com.example.tipcalc

import kotlin.math.ceil

data class TipResult(val tip: Double, val total: Double, val perPerson: Double)

/** Pure function: no Android classes, so it is easy to test (lesson 14). */
fun calculateTip(bill: Double, tipPercent: Int, people: Int, roundUp: Boolean): TipResult {
    require(people >= 1) { "people must be at least 1" }
    var tip = bill * tipPercent / 100.0
    if (roundUp) tip = ceil(tip)
    val total = bill + tip
    return TipResult(tip = tip, total = total, perPerson = total / people)
}
