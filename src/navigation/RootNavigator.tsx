import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppTabs from './AppTabs';
import PartialPalletScreen from '../screens/PartialPalletScreen';
import InfraredScannerScreen from '../screens/InfraredScannerScreen';
import CameraScanScreen from '../screens/CameraScanScreen';
import ManualEnterScreen from '../screens/ManualEnterScreen';
import { colors } from '../theme/colors';

export type RootStackParamList = {
  Main: undefined;
  PartialPallet: undefined;
  InfraredScanner: undefined;
  CameraScan: undefined;
  ManualEnter: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
      }}
    >
      <Stack.Screen
        name="Main"
        component={AppTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PartialPallet"
        component={PartialPalletScreen}
        options={{
          title: 'PARTIAL Pallet',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="InfraredScanner"
        component={InfraredScannerScreen}
        options={{
          title: 'Zebra Scanner',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="CameraScan"
        component={CameraScanScreen}
        options={{
          title: 'Camera',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="ManualEnter"
        component={ManualEnterScreen}
        options={{
          title: 'Enter Code',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
}
