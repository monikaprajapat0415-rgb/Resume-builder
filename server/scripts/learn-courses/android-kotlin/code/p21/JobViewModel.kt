package com.example.jobs

import android.content.ContentResolver
import android.net.Uri
import android.provider.OpenableColumns
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody

data class JobsState(
    val all: List<Job> = emptyList(),
    val loading: Boolean = true,
    val error: String? = null,
    val filter: JobFilter = JobFilter(),
    val applyMessage: String? = null,
    val applying: Boolean = false,
) {
    val shown: List<Job> get() = all.filtered(filter)
}

class JobViewModel(private val api: JobApi) : ViewModel() {
    private val _state = MutableStateFlow(JobsState())
    val state: StateFlow<JobsState> = _state.asStateFlow()

    init {
        load()
    }

    fun load() {
        _state.update { it.copy(loading = true, error = null) }
        viewModelScope.launch {
            try {
                val jobs = api.jobs(page = 1)
                _state.update { it.copy(all = jobs, loading = false) }
            } catch (e: Exception) {
                _state.update { it.copy(loading = false, error = "Could not load jobs. Pull to try again.") }
            }
        }
    }

    fun setFilter(f: JobFilter) {
        _state.update { it.copy(filter = f) }
    }

    fun apply(resolver: ContentResolver, jobId: String, cover: String, resume: Uri) {
        viewModelScope.launch {
            val mime = resolver.getType(resume)
            val size = withContext(Dispatchers.IO) {
                resolver.query(resume, null, null, null, null)?.use { c ->
                    val col = c.getColumnIndex(OpenableColumns.SIZE)
                    if (c.moveToFirst() && col >= 0) c.getLong(col) else 0L
                } ?: 0L
            }
            val problem = resumeProblem(mime, size)
            if (problem != null) {
                _state.update { it.copy(applyMessage = problem) }
                return@launch
            }
            _state.update { it.copy(applying = true, applyMessage = null) }
            try {
                val bytes = withContext(Dispatchers.IO) { resolver.openInputStream(resume)!!.use { it.readBytes() } }
                val part = MultipartBody.Part.createFormData(
                    "resume",
                    "resume",
                    bytes.toRequestBody(mime!!.toMediaType()),
                )
                val result = api.apply(jobId, cover.take(2000).toRequestBody("text/plain".toMediaType()), part)
                _state.update { it.copy(applying = false, applyMessage = if (result.ok) "Application sent" else result.message) }
            } catch (e: Exception) {
                _state.update { it.copy(applying = false, applyMessage = "Could not send the application. Try again.") }
            }
        }
    }

    fun messageShown() {
        _state.update { it.copy(applyMessage = null) }
    }
}
