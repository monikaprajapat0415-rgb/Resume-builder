package com.example.music

import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata

data class Track(val title: String, val artist: String, val url: String)

// Use audio you have the right to stream. These addresses are placeholders: replace them
// with your own files or with royalty-free audio you have checked.
object Tracks {
    val all = listOf(
        Track("Sample One", "Your Artist", "https://example.com/audio/one.mp3"),
        Track("Sample Two", "Your Artist", "https://example.com/audio/two.mp3"),
        Track("Sample Three", "Your Artist", "https://example.com/audio/three.mp3"),
    )
}

fun Track.toMediaItem(): MediaItem {
    return MediaItem.Builder()
        .setUri(url)
        .setMediaMetadata(MediaMetadata.Builder().setTitle(title).setArtist(artist).build())
        .build()
}

fun formatTime(ms: Long): String {
    val total = (ms / 1000).coerceAtLeast(0)
    return (total / 60).toString() + ":" + (total % 60).toString().padStart(2, '0')
}
