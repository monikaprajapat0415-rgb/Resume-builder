package com.example.qr

import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.common.InputImage

// Looks at each camera frame and reports the first QR code or barcode it finds.
class QrAnalyzer(private val onResult: (String) -> Unit) : ImageAnalysis.Analyzer {
    private val scanner = BarcodeScanning.getClient()

    @androidx.annotation.OptIn(androidx.camera.core.ExperimentalGetImage::class)
    override fun analyze(imageProxy: ImageProxy) {
        val media = imageProxy.image
        if (media == null) {
            imageProxy.close()
            return
        }
        val image = InputImage.fromMediaImage(media, imageProxy.imageInfo.rotationDegrees)
        scanner.process(image)
            .addOnSuccessListener { codes ->
                codes.firstOrNull { !it.rawValue.isNullOrBlank() }?.rawValue?.let(onResult)
            }
            .addOnCompleteListener { imageProxy.close() }   // always release the frame
    }
}

// Decides what kind of content a scanned text is, so the app can offer a sensible action.
sealed interface ScanKind {
    data class Link(val url: String) : ScanKind
    data class Wifi(val ssid: String) : ScanKind
    data class Text(val value: String) : ScanKind
}

fun classify(raw: String): ScanKind {
    val t = raw.trim()
    return when {
        t.startsWith("https://") || t.startsWith("http://") -> ScanKind.Link(t)
        t.startsWith("WIFI:") -> {
            val ssid = t.removePrefix("WIFI:").split(";").firstOrNull { it.startsWith("S:") }?.removePrefix("S:").orEmpty()
            ScanKind.Wifi(ssid)
        }
        else -> ScanKind.Text(t)
    }
}
