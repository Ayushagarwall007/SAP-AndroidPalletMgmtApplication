import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { BarcodeScanningResult } from 'expo-camera';
import { colors } from '../theme/colors';

const SCAN_THROTTLE_MS = 2000;

/**
 * Camera-based barcode/QR scanning (same codes as Zebra infrared scanner).
 * Uses expo-camera's built-in barcode scanner for QR and common barcode types.
 */
export default function CameraScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<string[]>([]);
  const lastScanTimeRef = useRef(0);

  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      const now = Date.now();
      if (now - lastScanTimeRef.current < SCAN_THROTTLE_MS) return;
      lastScanTimeRef.current = now;

      const data = result.data?.trim();
      if (!data) return;

      setLastScan(data);
      setScanHistory((prev) => [data, ...prev].slice(0, 20));
    },
    []
  );

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Checking camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.icon}>📷</Text>
        <Text style={styles.title}>Camera access needed</Text>
        <Text style={styles.message}>
          Allow camera access to scan barcodes and QR codes (same as Zebra
          scanner codes).
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Allow camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.linkText}>Open settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraWrap}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              'qr',
              'code128',
              'code39',
              'ean13',
              'ean8',
              'upc_e',
              'codabar',
              'itf14',
              'upc_a',
            ],
          }}
        />
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>
            Point at a barcode or QR code
          </Text>
        </View>
      </View>

      <View style={styles.results}>
        {lastScan ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Last scan</Text>
            <Text style={styles.resultValue} selectable>
              {lastScan}
            </Text>
          </View>
        ) : (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>No scan yet</Text>
          </View>
        )}

        {scanHistory.length > 1 && (
          <ScrollView
            style={styles.history}
            contentContainerStyle={styles.historyContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.historyTitle}>Recent scans</Text>
            {scanHistory.slice(1, 11).map((s, i) => (
              <Text key={i} style={styles.historyItem} selectable>
                {s}
              </Text>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cameraWrap: {
    flex: 1,
    minHeight: 240,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  results: {
    padding: 16,
    paddingTop: 12,
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -16,
    maxHeight: 280,
  },
  resultBox: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  placeholderBox: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  history: {
    flex: 1,
    maxHeight: 160,
  },
  historyContent: {
    paddingBottom: 8,
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  historyItem: {
    fontSize: 13,
    color: colors.text,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 160,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    fontSize: 15,
    color: colors.primary,
  },
});
