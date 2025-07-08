// navigation/SettingsStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SettingsScreen   from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createStackNavigator();

export default function SettingsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ title: 'Paramètres' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Modifier mon profil' }}
      />
    </Stack.Navigator>
  );
}
