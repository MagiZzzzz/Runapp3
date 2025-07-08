// navigation/FriendsStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import FriendsScreen       from '../screens/FriendsScreen';
import RecordMessageScreen from '../screens/RecordMessageScreen';

const Stack = createStackNavigator();

export default function FriendsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="FriendsList"
        component={FriendsScreen}
        options={{ title: 'Mes Amis' }}
      />
      <Stack.Screen
        name="RecordMessage"
        component={RecordMessageScreen}
        options={{ title: 'Envoyer un message vocal' }}
      />
    </Stack.Navigator>
  );
}
