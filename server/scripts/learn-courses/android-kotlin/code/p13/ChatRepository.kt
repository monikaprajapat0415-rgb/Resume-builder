package com.example.chat

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

data class Message(
    val id: String = "",
    val text: String = "",
    val from: String = "",
    val name: String = "",
)

class ChatRepository(
    private val auth: FirebaseAuth = FirebaseAuth.getInstance(),
    private val db: FirebaseFirestore = FirebaseFirestore.getInstance(),
) {
    val currentUid: String? get() = auth.currentUser?.uid

    suspend fun register(email: String, password: String): Result<Unit> = runCatching {
        auth.createUserWithEmailAndPassword(email, password).await()
        Unit
    }

    suspend fun signIn(email: String, password: String): Result<Unit> = runCatching {
        auth.signInWithEmailAndPassword(email, password).await()
        Unit
    }

    fun signOut() {
        auth.signOut()
    }

    suspend fun send(roomId: String, text: String): Result<Unit> = runCatching {
        val user = auth.currentUser ?: error("Not signed in")
        val data = mapOf(
            "text" to text,
            "from" to user.uid,
            "name" to (user.email ?: "unknown"),
            "at" to FieldValue.serverTimestamp(),
        )
        db.collection("rooms").document(roomId).collection("messages").add(data).await()
        Unit
    }

    fun messages(roomId: String): Flow<List<Message>> = callbackFlow {
        val registration = db.collection("rooms").document(roomId).collection("messages")
            .orderBy("at", Query.Direction.ASCENDING)
            .addSnapshotListener { snapshot, _ ->
                val list = snapshot?.documents?.map { doc ->
                    Message(
                        id = doc.id,
                        text = doc.getString("text").orEmpty(),
                        from = doc.getString("from").orEmpty(),
                        name = doc.getString("name").orEmpty(),
                    )
                }.orEmpty()
                trySend(list)
            }
        awaitClose { registration.remove() }
    }
}
