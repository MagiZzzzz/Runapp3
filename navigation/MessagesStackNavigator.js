// navigation/MessagesStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MessagesScreen   from '../screens/MessagesScreen';
import RecordMessageScreen from '../screens/RecordMessageScreen'; // si on permet de repost
// ou un MessageDetailScreen si tu en as un

const Stack = createStackNavigator();

export default function MessagesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MessagesList"
        component={MessagesScreen}
        options={{ title: 'Messages' }}
      />
      {/* <Stack.Screen name="MessageDetail" component={MessageDetailScreen} /> */}
    </Stack.Navigator>
  );
}
