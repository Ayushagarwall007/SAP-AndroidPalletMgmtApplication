import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';

/**
 * Zebra infrared scanner screen.
 * DataWedge (keystroke mode) sends scan data to the focused input. On Zebra
 * devices the target must be a visible, focused field — so we use a visible
 * "scanner input" box and re-focus it whenever the screen is shown.
 */
export default function InfraredScannerScreen() {
  const inputRef = useRef<TextInput>(null);
  const [scanBuffer, setScanBuffer] = useState('');
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<string[]>([]);

  // Re-focus scanner input every time this screen gets focus (critical for Zebra)
  useFocusEffect(
    useCallback(() => {
      const t = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);  
      return () => clearTimeout(t);
    }, [])
  );

  const handleSubmitEditing = () => {
    const trimmed = scanBuffer.trim();
    if (trimmed) {
      setLastScan(trimmed);
      setScanHistory((prev) => [trimmed, ...prev].slice(0, 20));
    }
    setScanBuffer('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleChangeText = (text: string) => {
    setScanBuffer(text);
  };

  const handleEndEditing = () => {
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        Press the side scan button and point at a barcode or QR code. Ensure
        DataWedge profile is set to Keystroke and associated with this app.
      </Text>

      {/* Visible scanner input — Zebra DataWedge needs a visible focused field */}
      <View style={styles.scannerInputWrap}>
        <Text style={styles.scannerInputLabel}>Scanner input (tap here if scan doesn’t work)</Text>
        <TextInput
          ref={inputRef}
          style={styles.scannerInput}
          value={scanBuffer}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmitEditing}
          onEndEditing={handleEndEditing}
          blurOnSubmit={false}
          showSoftInputOnFocus={false}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Scan will appear here..."
          placeholderTextColor={colors.textSecondary}
          caretHidden={false}
        />
      </View>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  instruction: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  resultBox: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  placeholderBox: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  history: {
    flex: 1,
  },
  historyContent: {
    paddingBottom: 24,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  historyItem: {
    fontSize: 14,
    color: colors.text,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scannerInputWrap: {
    marginBottom: 16,
  },
  scannerInputLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  scannerInput: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    minHeight: 48,
  },
});
