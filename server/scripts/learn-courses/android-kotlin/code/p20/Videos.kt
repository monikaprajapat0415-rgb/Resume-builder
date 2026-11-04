package com.example.video

data class Video(val title: String, val description: String, val url: String)

// Replace these with video addresses you have the right to stream.
// HLS (.m3u8) addresses give adaptive streaming: the player switches quality with your speed.
object Videos {
    val all = listOf(
        Video("Big Buck Bunny (HLS)", "Open movie used for player tests.", "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"),
        Video("Sample MP4", "A plain MP4 file.", "https://example.com/video/sample.mp4"),
    )
}

fun formatDuration(ms: Long): String {
    if (ms < 0) return "--:--"
    val s = ms / 1000
    val h = s / 3600
    val m = (s % 3600) / 60
    val sec = s % 60
    val mm = m.toString().padStart(2, '0')
    val ss = sec.toString().padStart(2, '0')
    return if (h > 0) h.toString() + ":" + mm + ":" + ss else (m.toString() + ":" + ss)
}
