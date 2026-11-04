package com.example.jobs

import kotlinx.serialization.Serializable

@Serializable
data class Job(
    val id: String,
    val title: String,
    val company: String,
    val location: String,
    val type: String = "Full-time",       // Full-time, Part-time, Internship, Contract
    val remote: Boolean = false,
    val description: String = "",
)

@Serializable
data class ApplyResult(val ok: Boolean, val message: String = "")

data class JobFilter(
    val query: String = "",
    val remoteOnly: Boolean = false,
    val type: String? = null,
)

// Filtering is done in plain Kotlin, so it is easy to test. A real backend would also filter on the server.
fun List<Job>.filtered(f: JobFilter): List<Job> {
    val q = f.query.trim().lowercase()
    return filter { job ->
        (q.isEmpty() || job.title.lowercase().contains(q) || job.company.lowercase().contains(q) || job.location.lowercase().contains(q)) &&
            (!f.remoteOnly || job.remote) &&
            (f.type == null || job.type == f.type)
    }
}

// Accept only resume files of reasonable size and type before uploading.
fun resumeProblem(mime: String?, sizeBytes: Long): String? {
    val allowed = setOf(
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )
    return when {
        mime == null || mime !in allowed -> "Choose a PDF or Word file."
        sizeBytes <= 0 -> "The file is empty."
        sizeBytes > 5L * 1024 * 1024 -> "The file must be 5 MB or smaller."
        else -> null
    }
}
