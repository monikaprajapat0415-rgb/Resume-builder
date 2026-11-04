package com.example.music

import android.app.Application
import android.content.ComponentName
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.session.MediaController
import androidx.media3.session.SessionToken
import com.google.common.util.concurrent.MoreExecutors
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class PlayerUi(
    val title: String = "",
    val artist: String = "",
    val playing: Boolean = false,
    val positionMs: Long = 0,
    val durationMs: Long = 0,
    val connected: Boolean = false,
)

class PlayerViewModel(app: Application) : AndroidViewModel(app) {
    private val _ui = MutableStateFlow(PlayerUi())
    val ui: StateFlow<PlayerUi> = _ui.asStateFlow()
    private var controller: MediaController? = null

    init {
        val token = SessionToken(app, ComponentName(app, PlaybackService::class.java))
        val future = MediaController.Builder(app, token).buildAsync()
        future.addListener({
            val c = future.get()
            controller = c
            c.setMediaItems(Tracks.all.map { it.toMediaItem() })
            c.prepare()
            c.addListener(object : Player.Listener {
                override fun onEvents(player: Player, events: Player.Events) {
                    publish(player)
                }
            })
            publish(c)
            _ui.update { it.copy(connected = true) }
        }, MoreExecutors.directExecutor())

        // the position is not pushed by the player, so poll it while the screen is alive
        viewModelScope.launch {
            while (true) {
                controller?.let { publish(it) }
                delay(500)
            }
        }
    }

    private fun publish(player: Player) {
        val meta = player.mediaMetadata
        _ui.update {
            it.copy(
                title = meta.title?.toString().orEmpty(),
                artist = meta.artist?.toString().orEmpty(),
                playing = player.isPlaying,
                positionMs = player.currentPosition,
                durationMs = player.duration.coerceAtLeast(0),
            )
        }
    }

    fun toggle() {
        controller?.let { if (it.isPlaying) it.pause() else it.play() }
    }

    fun next() {
        controller?.seekToNextMediaItem()
    }

    fun previous() {
        controller?.seekToPreviousMediaItem()
    }

    fun seekTo(ms: Long) {
        controller?.seekTo(ms)
    }

    override fun onCleared() {
        controller?.release()
    }
}
