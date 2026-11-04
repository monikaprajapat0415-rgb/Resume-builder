import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const D = 'Production Android';
const NOTE = "Snippets in this lesson are short patterns, not full projects. They were not compiled here. Paste them into Android Studio and check the current documentation of each library, because versions and API names change. Services that need accounts or keys (Firebase, Maps, payments, AI) must be set up with your own project and keys.";

export const lessons = [
  // 23
  les(D, 'networking-in-depth-okhttp-interceptors-jwt-oauth-and-pagination', 'Networking in Depth: OkHttp, JWT, OAuth, Pagination', 'Networking: OkHttp, JWT and OAuth',
    'Go deeper on Android networking: OkHttp interceptors, JWT and OAuth, token refresh, pagination, uploads, pinning and GraphQL.', [
    P("Project 6 made one simple request. Real apps send authenticated requests, handle failures, upload files, page through results and keep data safe in transit. This lesson covers the pieces behind production networking."),
    H("HTTP and REST in short"),
    L("**GET** reads, **POST** creates, **PUT** replaces, **PATCH** changes part, **DELETE** removes.", "Status codes: 2xx success, 3xx redirect, 401 not signed in, 403 not allowed, 404 not found, 429 too many requests, 5xx server error.", "Always use **HTTPS**. Android blocks plain HTTP by default, which is the right default.", "JSON is the usual format. Kotlin serialization (or Gson/Moshi in older apps) converts it to classes. XML is rare and seen in older APIs."),
    C('kotlin', `interface ShopApi {
    @GET("products") suspend fun products(@Query("page") page: Int): List<ProductDto>
    @GET("products/{id}") suspend fun product(@Path("id") id: Int): ProductDto
    @POST("orders") suspend fun order(@Body body: OrderRequest): OrderDto
    @PATCH("profile") suspend fun update(@Body body: ProfilePatch): ProfileDto
    @DELETE("orders/{id}") suspend fun cancel(@Path("id") id: Int)
    @Multipart @POST("upload")
    suspend fun upload(@Part file: MultipartBody.Part): UploadDto
}`),
    H("OkHttp and interceptors"),
    P("Retrofit sits on **OkHttp**, which does the real work. An **interceptor** sees every request and response, so it is the right place to add a token, log traffic in debug builds, or add a language header."),
    C('kotlin', `class AuthInterceptor(private val tokens: TokenStore) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request().newBuilder()
            .header("Authorization", "Bearer " + tokens.access())
            .build()
        return chain.proceed(request)
    }
}

val client = OkHttpClient.Builder()
    .addInterceptor(AuthInterceptor(tokenStore))
    .addInterceptor(HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BASIC })
    .connectTimeout(15, TimeUnit.SECONDS)
    .build()`),
    P("Only log request bodies in debug builds. Logging tokens or passwords in a release app is a security fault."),
    H("Authentication: JWT and OAuth 2.0"),
    P("After a user logs in with email and password, the server returns a **JWT** (JSON Web Token): a signed string that proves who the user is. It is short-lived (minutes), and usually comes with a longer-lived **refresh token**. Send the access token in the `Authorization: Bearer` header. When the server answers 401, use the refresh token to get a new access token and retry once. In OkHttp this is an `Authenticator`."),
    C('kotlin', `class TokenAuthenticator(private val tokens: TokenStore, private val auth: AuthApi) : Authenticator {
    override fun authenticate(route: Route?, response: Response): Request? {
        if (response.request.header("Retry") != null) return null     // give up after one retry
        val fresh = runBlocking { auth.refresh(tokens.refresh()) }.accessToken ?: return null
        tokens.save(access = fresh)
        return response.request.newBuilder()
            .header("Authorization", "Bearer " + fresh)
            .header("Retry", "1").build()
    }
}`),
    P("**OAuth 2.0** lets a user sign in through another provider (Google, GitHub) without giving your app their password. Mobile apps use the *authorization code flow with PKCE*, opened in a browser tab or with the Credential Manager for Google sign-in, and never embed a client secret. Use a maintained library (AppAuth, Credential Manager) rather than writing the flow yourself."),
    H("Errors, connectivity and results"),
    P("Wrap calls so the UI receives a result, not an exception: catch `IOException` (no network), `HttpException` (a bad status) and parse the server's error body. Check connectivity with `ConnectivityManager` and `registerDefaultNetworkCallback`, but never rely on it alone: a call can still fail, so always handle errors. Retry only safe (idempotent) requests, with a growing delay."),
    H("Pagination, upload and download, caching"),
    L("**Pagination**: page numbers (`?page=2`) or cursors (`?after=abc`). Use Paging 3 to drive it.", "**Upload**: `MultipartBody.Part` with a `RequestBody` made from the file. Show progress by wrapping the body. For large or background uploads use WorkManager.", "**Download**: stream a `ResponseBody` to a file in chunks, never load it all in memory.", "**Caching**: OkHttp can cache responses that allow it with `Cache(directory, size)`; Coil caches images; Room caches data you need offline."),
    H("Network security"),
    L("Use HTTPS everywhere and do not disable certificate checks, even in tests.", "**Certificate pinning** (`CertificatePinner`) makes the app trust only your server's key. It adds protection against some attacks, but if the certificate changes and you did not plan for it, the app stops working, so pin with backups.", "Keep secrets on a server. Do not trust the app to hide an API key.", "Use a network security config only if you must allow special rules."),
    H("GraphQL"),
    P("GraphQL lets the client ask for exactly the fields it needs in one request. On Android the usual library is Apollo Kotlin, which generates Kotlin types from your queries. Choose it when your backend already offers GraphQL. REST with Retrofit remains the most common."),
    N(NOTE),
    ...task("Add an interceptor to a project that adds a header and logs the URL in debug builds only.", "Write a fake server response for a 401 using MockWebServer and test that the authenticator retries once.", "Upload an image with a multipart request to a test endpoint.", "Add a retry with growing delay for a GET request."),
    ...check("Tokens never appear in release logs.", "A 401 triggers one refresh and one retry, not a loop.", "You can explain JWT, refresh token and OAuth in your own words."),
  ], A('Token refresh', [
    n('app', 'App request', 'Bearer access token', 0, 0, 'app'), n('srv', 'Server', 'checks the token', 1, 0, 'cloud'),
    n('auth', 'Authenticator', 'uses refresh token', 2, 0, 'tool'), n('retry', 'Retry once', 'new access token', 3, 0, 'out'),
  ], [
    { say: 'An interceptor adds the access token to each request.', on: ['app'] },
    { say: 'The server rejects an expired token with status 401.', flow: ['app>srv:request'] },
    { say: 'The authenticator asks for a new token using the refresh token.', flow: ['srv>auth:401'] },
    { say: 'The original request is repeated once with the new token.', flow: ['auth>retry:new token'] },
  ]), [
    faq('What is a JWT?', 'A signed token the server issues after login. The server can verify it without a database lookup. Treat it like a password: keep it in secure storage and never log it.'),
    faq('Is certificate pinning required?', 'No. It adds protection but also risk if a certificate changes. Many apps rely on normal HTTPS. High-risk apps such as banking often pin.'),
    faq('Where do I keep an API secret?', 'On your server. A key inside an app can be extracted, so the app should call your server and the server holds the secret.'),
  ]),

  // 24
  les(D, 'firebase-for-android-auth-firestore-storage-push-and-analytics', 'Firebase for Android: Auth, Firestore, Storage, Push, Analytics', 'Firebase for Android: Auth and Firestore',
    'Add Firebase to Android: email and Google sign-in, Firestore, Storage, push messaging, Crashlytics, Remote Config and security rules.', [
    P("Firebase is Google's backend for apps. It gives you accounts, a database, file storage, push notifications and monitoring without running your own server. It is a quick way to build real-time apps such as the chat project. Its services and screens change often, so use the current Firebase documentation for setup steps and treat this lesson as the map."),
    H("Set up a Firebase project"),
    O("Open the Firebase console and create a project.", "Add an Android app with your application ID (the one from `build.gradle.kts`).", "Download `google-services.json` and place it in the `app` folder. Add it to `.gitignore` if your repository is public and you are not ready to share the project details.", "Add the Google services Gradle plugin and the Firebase BoM, then the libraries you need, for example `firebase-auth`, `firebase-firestore`, `firebase-storage`, `firebase-messaging`, `firebase-analytics`, `firebase-crashlytics`, `firebase-config`.", "Sync, run, and check the console for the first connection."),
    H("Authentication"),
    L("**Email and password**: `Firebase.auth.createUserWithEmailAndPassword` and `signInWithEmailAndPassword`. Send a verification email and a password-reset email.", "**Google Sign-In**: use the Credential Manager API to get a Google ID token and exchange it with `GoogleAuthProvider.getCredential`.", "**Phone number**: sends an SMS code, and needs setup of SHA fingerprints and, in testing, test numbers.", "Read the signed-in user with `Firebase.auth.currentUser` or a listener, and sign out with `signOut()`."),
    C('kotlin', `suspend fun signIn(email: String, password: String): Result<String> = try {
    val result = Firebase.auth.signInWithEmailAndPassword(email, password).await()
    Result.success(result.user?.uid.orEmpty())
} catch (e: Exception) {
    Result.failure(e)
}`),
    P("`await()` comes from the kotlinx-coroutines-play-services library and turns a Firebase Task into a suspend call."),
    H("Cloud Firestore and Realtime Database"),
    P("**Firestore** stores *documents* (like JSON objects) in *collections*. It supports queries and live listeners and works offline with a local cache. The **Realtime Database** is an older, simpler JSON tree, good for very small, fast data. For most new apps choose Firestore."),
    C('kotlin', `val db = Firebase.firestore

// write
db.collection("rooms").document(roomId).collection("messages")
    .add(mapOf("text" to text, "from" to uid, "at" to FieldValue.serverTimestamp()))

// live updates as a Flow
fun messages(roomId: String): Flow<List<Message>> = callbackFlow {
    val reg = db.collection("rooms").document(roomId).collection("messages")
        .orderBy("at")
        .addSnapshotListener { snap, _ ->
            trySend(snap?.toObjects(Message::class.java).orEmpty())
        }
    awaitClose { reg.remove() }
}`),
    H("Storage, push messaging and monitoring"),
    L("**Cloud Storage**: upload images and files with `Firebase.storage.reference.child(path).putFile(uri)` and get a download URL.", "**Cloud Messaging (FCM)**: the server (or the console) sends a push message to a device token. Your `FirebaseMessagingService` receives data messages; notification messages are shown by the system when the app is in the background. On Android 13 and later the user must allow notifications.", "**Analytics**: log events like `purchase` or `sign_up` to see how people use the app.", "**Crashlytics**: collects crash reports with stack traces from real devices.", "**Remote Config**: change values (a banner text, a feature flag) without a new release.", "**Performance Monitoring**: measures startup time and network calls.", "**App Distribution**: sends test builds to testers."),
    H("Security rules and App Check"),
    P("Anyone can read your app's `google-services.json`, so the database is protected only by **security rules**. Write rules that require sign-in and limit each user to their own data. Never leave test-mode rules (open to everyone) on a live project. **App Check** adds a check that requests come from your genuine app."),
    C('text', `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /rooms/{roomId}/messages/{msgId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.from == request.auth.uid;
    }
  }
}`),
    N(NOTE),
    ...task("Create a Firebase project, connect an app and sign in with email and password.", "Write a message to Firestore and see it appear in the console.", "Add a listener and show messages live on two devices.", "Write security rules and test them in the Firebase Rules Playground."),
    ...check("Only signed-in users can read messages.", "Messages appear on a second device without a refresh.", "You know why test-mode rules are unsafe."),
  ], A('Firebase pieces', [
    n('app', 'Android app', 'google-services.json', 0, 0, 'app'), n('auth', 'Auth', 'who is the user', 1, 0, 'check'),
    n('fs', 'Firestore', 'documents + listeners', 2, 0, 'store'), n('fcm', 'FCM push', 'wake the device', 3, 0, 'out'),
  ], [
    { say: 'The app connects to your Firebase project with the config file.', on: ['app'] },
    { say: 'The user signs in, and Firebase gives the app a user id.', flow: ['app>auth:sign in'] },
    { say: 'Security rules use that id to allow or refuse reads and writes in Firestore.', flow: ['auth>fs:uid'] },
    { say: 'Messaging pushes a notification to other devices.', flow: ['fs>fcm:new data'] },
  ]), [
    faq('Firestore or Realtime Database?', 'Choose Firestore for most apps: better queries and scaling. Realtime Database is simpler and fine for small, very fast data.'),
    faq('Is Firebase free?', 'There is a free plan with limits, and paid usage beyond them. Check current pricing before you build something that will grow.'),
    faq('Can the app be hacked if config is public?', 'The config file only identifies your project. Security rules and App Check protect the data, so write them carefully.'),
  ]),

  // 25
  les(D, 'android-security-keystore-biometrics-r8-and-owasp-mobile', 'Android Security: Keystore, Biometrics, R8 and OWASP Mobile', 'Android Security: Keystore and Biometrics',
    'Secure an Android app: Keystore encryption, biometric login, R8, safe communication and the main OWASP Mobile ideas.', [
    P("Security is part of every app that handles accounts, money or personal data. The goal is simple: protect the user's data on the device and on the network, and assume that a determined person can inspect your APK. This lesson lists the practical steps."),
    H("Login, passwords and OTP"),
    L("Validate on the device for good feedback (email shape, minimum length), and on the server for real. Never rely only on the app.", "Never store a password. Store a short-lived token, and ask for the password again for sensitive actions.", "Rate-limit and lock out repeated wrong attempts on the server.", "OTP (one-time password) codes should expire quickly and be single-use. Let the user request a new one, but not endlessly."),
    H("Android Keystore and encrypted storage"),
    P("The **Android Keystore** stores cryptographic keys in protected hardware where available, so your app can use a key but cannot read it out. Create an AES key in the Keystore, encrypt the token with it, and store the encrypted bytes. The older `EncryptedSharedPreferences` does this for you but is deprecated in recent versions of the security library, so check the current guidance; a DataStore plus Keystore encryption (for example through the Tink library) is the modern pattern."),
    C('kotlin', `fun createKey(alias: String): SecretKey {
    val generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")
    generator.init(
        KeyGenParameterSpec.Builder(alias, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .build()
    )
    return generator.generateKey()
}

fun encrypt(key: SecretKey, plain: ByteArray): Pair<ByteArray, ByteArray> {
    val cipher = Cipher.getInstance("AES/GCM/NoPadding")
    cipher.init(Cipher.ENCRYPT_MODE, key)
    return cipher.iv to cipher.doFinal(plain)      // store the iv with the data
}`),
    P("Do not invent your own cryptography. Use well-known libraries and the algorithms above, and keep the key in the Keystore, never in code."),
    H("Biometric authentication"),
    P("The **BiometricPrompt** API shows the system fingerprint or face dialog, so you never handle biometric data yourself. Use it to unlock the app or to approve an action, and ideally tie it to a Keystore key that needs authentication (`setUserAuthenticationRequired(true)`). Always offer a fallback such as device credentials."),
    C('kotlin', `val info = BiometricPrompt.PromptInfo.Builder()
    .setTitle("Unlock")
    .setSubtitle("Confirm it is you")
    .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.DEVICE_CREDENTIAL)
    .build()

val prompt = BiometricPrompt(activity, ContextCompat.getMainExecutor(activity),
    object : BiometricPrompt.AuthenticationCallback() {
        override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) { unlock() }
    })
prompt.authenticate(info)`),
    H("R8, obfuscation and tampering"),
    P("R8 shrinks and renames code in release builds (`isMinifyEnabled = true`). That makes reverse engineering harder, but it is **not** security: assume attackers can read your logic. Root detection and integrity checks (Play Integrity API) can raise the effort for fraud-prone apps, but they can be bypassed, so enforce the important rules on the server."),
    H("OWASP Mobile ideas and best practice"),
    L("**Improper credential usage**: no keys or passwords in the app.", "**Insecure communication**: HTTPS only, validate certificates.", "**Insecure data storage**: sensitive data encrypted, and not in logs, backups or screenshots (`FLAG_SECURE` on sensitive screens).", "**Insufficient input validation**: validate everything, including deep link and intent data.", "**Insecure authentication**: short-lived tokens, server-side checks.", "Keep dependencies updated, request only the permissions you need, and mark components `exported=false` unless they must be public."),
    N(NOTE),
    ...task("Encrypt a token with a Keystore key and decrypt it again.", "Add a biometric unlock screen to one project with a device credential fallback.", "Turn on R8 for a release build and confirm the app still works.", "Review one project against the list above and write down three fixes."),
    ...check("No secret appears in the source or logs.", "Biometric login falls back correctly.", "You can say why obfuscation is not real security."),
  ], A('Protect the token', [
    n('login', 'Login', 'server gives token', 0, 0, 'user'), n('key', 'Keystore key', 'cannot be read out', 1, 0, 'check'),
    n('enc', 'Encrypted token', 'stored on disk', 2, 0, 'store'), n('bio', 'Biometric', 'unlocks use', 3, 0, 'out'),
  ], [
    { say: 'After login the server returns a token.', on: ['login'] },
    { say: 'A key in the Android Keystore encrypts it. The key itself never leaves secure storage.', flow: ['login>key:encrypt'] },
    { say: 'Only the encrypted bytes are saved.', flow: ['key>enc:store'] },
    { say: 'To use the token again, the user confirms with fingerprint or face.', flow: ['enc>bio:decrypt'] },
  ]), [
    faq('Is obfuscation enough to protect my app?', 'No. It only slows people down. Put real rules and secrets on the server.'),
    faq('Where do I keep an auth token?', 'Encrypted with a Keystore key, in DataStore or a similar store. Not in plain SharedPreferences, logs or code.'),
    faq('Do I handle fingerprint data myself?', 'No. BiometricPrompt shows the system dialog and only tells you success or failure.'),
  ]),

  // 26
  les(D, 'background-work-and-device-features-camera-location-maps-sensors-payments', 'Background Work and Device Features: Location, Maps, Sensors, Payments', 'Background Work, Location, Maps, Sensors',
    'Learn WorkManager, foreground services and alarms, then location, Google Maps, camera, sensors, Bluetooth and payment basics.', [
    P("Phones have many features apps can use: the camera, GPS, sensors, Bluetooth and payments. Many of them need permissions and run into Android's limits on background work. This lesson shows the main tools and the rules that decide which one to use."),
    H("Choosing a background tool"),
    L("**Coroutines**: work while the app is open and tied to a screen.", "**WorkManager**: deferrable work that must finish even if the app closes or the phone restarts (sync, uploads). Add constraints: network type, charging, battery not low. Use `OneTimeWorkRequest` or `PeriodicWorkRequest` (at least 15 minutes) and set a backoff for retries.", "**Foreground service**: work the user knows about, with a notification: music, navigation, active workouts. Declare a foreground service type in the manifest.", "**AlarmManager**: time-exact alarms (alarm clocks, calendar reminders). Exact alarms need special permission on recent Android versions.", "**JobScheduler**: the system API under WorkManager; use WorkManager instead."),
    C('kotlin', `val request = OneTimeWorkRequestBuilder<SyncWorker>()
    .setConstraints(Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build())
    .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 30, TimeUnit.SECONDS)
    .build()
WorkManager.getInstance(context).enqueueUniqueWork("sync", ExistingWorkPolicy.KEEP, request)

class SyncWorker(ctx: Context, params: WorkerParameters) : CoroutineWorker(ctx, params) {
    override suspend fun doWork(): Result = try {
        repo.sync(); Result.success()
    } catch (e: IOException) { Result.retry() }
}`),
    P("Android limits background work to protect battery: Doze mode, app standby buckets and background start restrictions. Do not fight them. Design for deferred, retriable work, and test on a real device."),
    H("Notifications"),
    P("Create a **channel** (Android 8+), build the notification with `NotificationCompat.Builder`, and ask for `POST_NOTIFICATIONS` on Android 13+. Add a `PendingIntent` so tapping it opens the right screen."),
    H("Location and maps"),
    L("Use the **Fused Location Provider** from Google Play services. Ask for `ACCESS_COARSE_LOCATION` and `ACCESS_FINE_LOCATION`; request background location only if truly needed, and explain why.", "`getCurrentLocation` for one fix, `requestLocationUpdates` for tracking (stop it when the screen goes away to save battery).", "**Maps Compose** shows a Google Map with `GoogleMap { Marker(...) }`. It needs a Maps API key from Google Cloud, kept out of the repository and restricted to your app.", "**Geofencing** notifies you when the user enters or leaves an area, using `GeofencingClient`.", "Decide with the user in mind: precise location is sensitive. Ask only when needed, and delete what you do not need."),
    H("Camera, media and files"),
    L("**CameraX** for photo, video and analysis. **PickVisualMedia** for the photo picker, which needs no permission.", "**Media3** (ExoPlayer) for audio and video playback; **MediaRecorder** for recording audio and video.", "**Files**: use app-specific storage for your own files, the Storage Access Framework for documents the user chooses, and MediaStore for shared media. Broad storage access is restricted.", "**PDF**: `PdfDocument` creates PDFs from views or canvas; `PdfRenderer` shows pages."),
    H("Sensors and connectivity"),
    L("**SensorManager** with `Sensor.TYPE_ACCELEROMETER` and a `SensorEventListener` (register in `onResume`, unregister in `onPause`, or with DisposableEffect). Use step counter sensors or **Health Connect** for fitness data, with the user's permission.", "**Bluetooth Low Energy** needs `BLUETOOTH_SCAN` and `BLUETOOTH_CONNECT` permissions on recent Android versions; scan, connect with GATT and read characteristics.", "**NFC** reads tags through `NfcAdapter` and intents.", "**Wi-Fi** APIs are limited in recent versions; use `ConnectivityManager` for state.", "**Speech**: `SpeechRecognizer` for speech to text and `TextToSpeech` for the reverse. **Contacts** and **Calendar** use content providers and need their own permissions."),
    H("Payments"),
    P("Never process cards yourself. For digital goods sold in the app, Google Play requires **Play Billing**. For physical goods and services, use a payment provider's SDK (Google Pay with a gateway such as Stripe or Razorpay). The app collects a payment token from the SDK, and **your server** talks to the gateway and confirms the order. The food-delivery and e-commerce projects use a demo flow only."),
    N(NOTE),
    ...task("Schedule a WorkManager job with a network constraint and watch it in the Background Task Inspector.", "Show your location on a Maps Compose screen with your own key.", "Read the accelerometer and show a live number.", "List which permission each feature above needs and when you would ask."),
    ...check("Background work survives closing the app.", "Location updates stop when the screen closes.", "Payment secrets stay on the server."),
  ], A('Pick the right tool', [
    n('app', 'Screen open', 'coroutines', 0, 0, 'app'), n('wm', 'WorkManager', 'deferred, reliable', 1, 0, 'tool'),
    n('fg', 'Foreground service', 'user-visible work', 2, 0, 'check'), n('al', 'AlarmManager', 'exact time', 3, 0, 'out'),
  ], [
    { say: 'Work tied to a visible screen uses coroutines.', on: ['app'] },
    { say: 'Work that must finish later, even if the app closes, uses WorkManager.', flow: ['app>wm:deferred'] },
    { say: 'Work the user is aware of, like music, runs in a foreground service with a notification.', flow: ['wm>fg:visible'] },
    { say: 'Only truly time-exact tasks such as alarms use AlarmManager.', flow: ['fg>al:exact'] },
  ]), [
    faq('Why did my background work not run on time?', 'Doze and battery limits delay work. WorkManager is designed to run it when the system allows. Use a foreground service or an exact alarm only when the feature really needs it.'),
    faq('Do I need a Maps API key?', 'Yes, Google Maps needs a key from Google Cloud. Restrict it to your app and keep it out of public code.'),
    faq('Can the app store card numbers?', 'No. Use a payment provider SDK so card data goes to the provider, and let your server confirm payments.'),
  ]),
];
