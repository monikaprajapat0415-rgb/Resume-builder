package com.example.todo

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test

class TodoViewModelTest {
    @get:Rule val mainRule = MainDispatcherRule()

    @Test
    fun addTrimsAndStoresTask() {
        val vm = TodoViewModel()
        vm.add("  Buy milk  ")
        assertEquals(listOf("Buy milk"), vm.tasks.value.map { it.title })
    }

    @Test
    fun blankTaskIsIgnored() {
        val vm = TodoViewModel()
        vm.add("   ")
        assertTrue(vm.tasks.value.isEmpty())
    }

    @Test
    fun toggleAndClearDone() {
        val vm = TodoViewModel()
        vm.add("One"); vm.add("Two")
        vm.toggle(vm.tasks.value.first().id)
        vm.clearDone()
        assertEquals(listOf("Two"), vm.tasks.value.map { it.title })
    }
}
