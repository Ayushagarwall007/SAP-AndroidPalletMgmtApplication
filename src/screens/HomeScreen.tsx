import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setApiLoading, setSapAuthSuccess, setSapAuthError } from '../store/slices/appSlice';
import { refreshSapToken } from '../api/sapAuth';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { sapAuth } = useAppSelector((state) => state.app);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshToken = async () => {
    setRefreshing(true);
    dispatch(setApiLoading(true));
    try {
      const result = await refreshSapToken();
      console.log('result', result);
      if (result.csrfToken) {
        dispatch(
          setSapAuthSuccess({
            csrfToken: result.csrfToken,
            cookieHeader: result.cookieHeader,
          })
        );
        Alert.alert('Success', 'CSRF token saved. You can use it for further API calls.');
      } else if (result.cookieHeader) {
        // Save cookies even when we got login page (no CSRF yet) so they can be used for later requests
        dispatch(
          setSapAuthSuccess({
            csrfToken: null,
            cookieHeader: result.cookieHeader,
          })
        );
        Alert.alert(
          'Cookies saved',
          result.isHtmlResponse
            ? 'Session cookies saved. Sign in may be required for full API access.'
            : 'Cookies saved for further API calls.'
        );
      } else {
        const message = result.isHtmlResponse
          ? 'Server returned login page. You may need to sign in first.'
          : `No CSRF token in response (status ${result.status}).`;
        dispatch(setSapAuthError(message));
        Alert.alert('Refresh Token', message);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Request failed';
      dispatch(setSapAuthError(message));
      Alert.alert('Error', message);
    } finally {
      setRefreshing(false);
      dispatch(setApiLoading(false));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SAP Mobile</Text>
      <Text style={styles.subtitle}>Welcome to your app</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PartialPallet')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Partial Pallet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {}}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Full Pallet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={handleRefreshToken}
        activeOpacity={0.8}
        disabled={refreshing}
      >
        {refreshing ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : (
          <Text style={styles.buttonTextSecondary}>Refresh Token</Text>
        )}
      </TouchableOpacity>

      {(sapAuth.csrfToken || sapAuth.cookieHeader) && (
        <Text style={styles.tokenHint}>
          {sapAuth.csrfToken ? 'Token saved for API calls' : 'Cookies saved for API calls'}
        </Text>
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
    marginBottom: 32,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.surface,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonTextSecondary: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
  },
  tokenHint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 12,
  },
});
