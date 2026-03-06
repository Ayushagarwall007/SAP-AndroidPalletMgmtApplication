import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';

export default function ManualEnterScreen() {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed) {
      setSubmitted(trimmed);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <Text style={styles.label}>Enter code manually</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(t) => {
          setValue(t);
          setSubmitted(null);
        }}
        placeholder="Scan or type code..."
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      <TouchableOpacity
        style={[styles.button, !value.trim() && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!value.trim()}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      {submitted !== null && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Entered</Text>
          <Text style={styles.resultValue}>{submitted}</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.surface,
  },
  resultBox: {
    marginTop: 24,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
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
});
