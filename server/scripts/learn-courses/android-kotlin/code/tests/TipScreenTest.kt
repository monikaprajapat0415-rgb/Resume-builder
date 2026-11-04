package com.example.tipcalc

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performTextInput
import org.junit.Rule
import org.junit.Test

// Runs on an emulator or a phone (androidTest folder).
class TipScreenTest {
    @get:Rule val rule = createComposeRule()

    @Test
    fun typingABillShowsTheTotal() {
        rule.setContent { TipScreen() }
        rule.onNodeWithText("Bill amount").performTextInput("100")
        rule.onNodeWithText("Total: 115.00").assertIsDisplayed()     // default tip is 15%
    }
}
