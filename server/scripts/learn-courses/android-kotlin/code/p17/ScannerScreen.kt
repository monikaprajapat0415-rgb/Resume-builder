package com.example.qr

import android.Manifest
import android.content.Intent
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import java.util.concurrent.Executors

@Composable
fun ScannerScreen() {
    val context = LocalContext.current
    var granted by remember {
        mutableStateOf(ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == android.content.pm.PackageManager.PERMISSION_GRANTED)
    }
    var result by remember { mutableStateOf<ScanKind?>(null) }
    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted = it }

    if (!granted) {
        Column(Modifier.fillMaxSize().padding(24.dp)) {
            Text("The camera is needed to read QR codes. Nothing is recorded or stored.")
            Button(onClick = { launcher.launch(Manifest.permission.CAMERA) }) { Text("Allow camera") }
        }
        return
    }

    Column(Modifier.fillMaxSize()) {
        if (result == null) {
            CameraPreview(Modifier.weight(1f).fillMaxWidth()) { text ->
                if (result == null) result = classify(text)
            }
            Text("Point the camera at a QR code", Modifier.padding(16.dp))
        } else {
            ResultCard(result!!, onAgain = { result = null })
        }
    }
}

@Composable
private fun CameraPreview(modifier: Modifier, onCode: (String) -> Unit) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val executor = remember { Executors.newSingleThreadExecutor() }

    AndroidView(
        modifier = modifier,
        factory = { ctx ->
            val view = PreviewView(ctx)
            val providerFuture = ProcessCameraProvider.getInstance(ctx)
            providerFuture.addListener({
                val provider = providerFuture.get()
                val preview = Preview.Builder().build().also { it.setSurfaceProvider(view.surfaceProvider) }
                val analysis = ImageAnalysis.Builder()
                    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                    .build()
                    .also { it.setAnalyzer(executor, QrAnalyzer(onCode)) }
                provider.unbindAll()
                provider.bindToLifecycle(lifecycleOwner, CameraSelector.DEFAULT_BACK_CAMERA, preview, analysis)
            }, ContextCompat.getMainExecutor(context))
            view
        },
    )
}

@Composable
private fun ResultCard(kind: ScanKind, onAgain: () -> Unit) {
    val context = LocalContext.current
    Card(Modifier.fillMaxWidth().padding(16.dp)) {
        Column(Modifier.padding(16.dp)) {
            when (kind) {
                is ScanKind.Link -> {
                    Text("Link", style = MaterialTheme.typography.titleMedium)
                    Text(kind.url)
                    Text("Only open links you trust.", style = MaterialTheme.typography.bodySmall)
                    Button(onClick = { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(kind.url))) }) { Text("Open") }
                }
                is ScanKind.Wifi -> {
                    Text("Wi-Fi network", style = MaterialTheme.typography.titleMedium)
                    Text(kind.ssid)
                }
                is ScanKind.Text -> {
                    Text("Text", style = MaterialTheme.typography.titleMedium)
                    Text(kind.value)
                }
            }
            Row(Modifier.padding(top = 12.dp)) {
                OutlinedButton(onClick = onAgain) { Text("Scan again") }
            }
        }
    }
}
