package com.example.jobs

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Test

class JobTest {
    private val jobs = listOf(
        Job("1", "Android Developer", "Acme", "Pune", "Full-time", remote = false),
        Job("2", "Backend Intern", "Globex", "Remote", "Internship", remote = true),
        Job("3", "Kotlin Engineer", "Initech", "Delhi", "Contract", remote = true),
    )

    @Test
    fun searchMatchesTitleCompanyAndCity() {
        assertEquals(1, jobs.filtered(JobFilter(query = "acme")).size)
        assertEquals(1, jobs.filtered(JobFilter(query = "delhi")).size)
        assertEquals(3, jobs.filtered(JobFilter(query = "e")).size)
    }

    @Test
    fun remoteAndTypeFiltersCombine() {
        val r = jobs.filtered(JobFilter(remoteOnly = true, type = "Contract"))
        assertEquals(listOf("3"), r.map { it.id })
    }

    @Test
    fun resumeRules() {
        assertNull(resumeProblem("application/pdf", 1000))
        assertNotNull(resumeProblem("image/png", 1000))
        assertNotNull(resumeProblem("application/pdf", 6L * 1024 * 1024))
        assertNotNull(resumeProblem("application/pdf", 0))
    }
}
