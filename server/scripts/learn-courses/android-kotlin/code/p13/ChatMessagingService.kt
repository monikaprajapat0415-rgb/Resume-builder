package com.example.chat

import android.app.NotificationChannel
import android.app.NotificationManager
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

// Receives push messages from Firebase Cloud Messaging.
// Sending them needs a server or Cloud Function that calls FCM when a message is created.
class ChatMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        // Send this token to your server so it knows where to push for this user.
    }

    override fun onMessageReceived(message: RemoteMessage) {
        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(
            NotificationChannel("chat", "Chat messages", NotificationManager.IMPORTANCE_DEFAULT),
        )
        val title = message.data["title"] ?: "New message"
        val body = message.data["body"] ?: ""
        val notification = NotificationCompat.Builder(this, "chat")
            .setSmallIcon(android.R.drawable.ic_dialog_email)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .build()
        // On Android 13 and newer the user must have allowed POST_NOTIFICATIONS.
        manager.notify(System.currentTimeMillis().toInt(), notification)
    }
}
