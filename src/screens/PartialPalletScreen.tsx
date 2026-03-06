import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';

type PartialPalletNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PartialPallet'>;

export default function PartialPalletScreen() {
  const navigation = useNavigation<PartialPalletNavigationProp>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('InfraredScanner')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonIcon}>📟</Text>
        <Text style={styles.buttonText}>Infrared Scanner</Text>
        <Text style={styles.buttonHint}>Zebra scanner / QR code</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CameraScan')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonIcon}>📷</Text>
        <Text style={styles.buttonText}>Camera</Text>
        <Text style={styles.buttonHint}>Scan with device camera</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ManualEnter')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonIcon}>⌨️</Text>
        <Text style={styles.buttonText}>Enter</Text>
        <Text style={styles.buttonHint}>Type code manually</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: 16,
  },
  button: {
    backgroundColor: colors.surface,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  buttonHint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
