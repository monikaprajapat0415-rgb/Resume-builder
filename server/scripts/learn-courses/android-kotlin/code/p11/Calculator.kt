package com.example.calculator

// Evaluates a plain text expression such as "12+3*4" without using eval.
// Supports + - * / and decimal numbers, with the usual order of operations.
object Calculator {

    fun evaluate(expression: String): Double? {
        val tokens = tokenize(expression) ?: return null
        if (tokens.isEmpty()) return null

        // first pass: * and /
        val afterMulDiv = mutableListOf<String>()
        var i = 0
        while (i < tokens.size) {
            val t = tokens[i]
            if (t == "*" || t == "/") {
                val left = afterMulDiv.removeLastOrNull()?.toDoubleOrNull() ?: return null
                val right = tokens.getOrNull(i + 1)?.toDoubleOrNull() ?: return null
                if (t == "/" && right == 0.0) return null
                afterMulDiv.add((if (t == "*") left * right else left / right).toString())
                i += 2
            } else {
                afterMulDiv.add(t)
                i += 1
            }
        }

        // second pass: + and -
        var result = afterMulDiv.firstOrNull()?.toDoubleOrNull() ?: return null
        var j = 1
        while (j < afterMulDiv.size) {
            val op = afterMulDiv[j]
            val value = afterMulDiv.getOrNull(j + 1)?.toDoubleOrNull() ?: return null
            result = if (op == "+") result + value else result - value
            j += 2
        }
        return result
    }

    private fun tokenize(text: String): List<String>? {
        val tokens = mutableListOf<String>()
        val number = StringBuilder()
        for (ch in text.filter { !it.isWhitespace() }) {
            when {
                ch.isDigit() || ch == '.' -> number.append(ch)
                ch in "+-*/" -> {
                    if (number.isEmpty()) {
                        // a leading minus belongs to the next number
                        if (ch == '-' && tokens.isEmpty()) number.append(ch) else return null
                    } else {
                        tokens.add(number.toString())
                        number.clear()
                        tokens.add(ch.toString())
                    }
                }
                else -> return null
            }
        }
        if (number.isEmpty()) return null
        tokens.add(number.toString())
        return tokens
    }

    fun format(value: Double): String {
        return if (value == value.toLong().toDouble()) value.toLong().toString() else value.toString()
    }
}
