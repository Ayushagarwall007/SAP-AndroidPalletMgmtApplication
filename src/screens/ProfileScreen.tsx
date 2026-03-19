import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { useAppSelector } from '../store/hooks';

export default function ProfileScreen() {
  const cookieHeader = useAppSelector((state) => state.app.sapAuth.cookieHeader);
  const [showCookie, setShowCookie] = useState(false);
  console.log('cookieHeader', cookieHeader);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Settings and account</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowCookie((v) => !v)}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      {showCookie && (
        <View style={styles.cookieBox}>
          <Text style={styles.cookieLabel}>Saved cookie response</Text>
          <ScrollView
            style={styles.cookieScroll}
            contentContainerStyle={styles.cookieScrollContent}
            showsVerticalScrollIndicator
          >
            <Text style={styles.cookieText} selectable>
              {cookieHeader || 'No cookie saved.'}
            </Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.surface,
  },
  cookieBox: {
    alignSelf: 'stretch',
    maxHeight: 280,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cookieLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  cookieScroll: {
    flex: 1,
    maxHeight: 240,
  },
  cookieScrollContent: {
    paddingBottom: 8,
  },
  cookieText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: 'monospace',
  },
});
