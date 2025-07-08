// navigation/HomeStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen          from '../screens/HomeScreen';
import CourseSearchScreen  from '../screens/CourseSearchScreen';
import RecordMessageScreen from '../screens/RecordMessageScreen';
import CourseFormScreen   from '../screens/CourseFormScreen';

const Stack = createStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: 'Accueil' }}
      />
      <Stack.Screen
        name="CourseSearch"
        component={CourseSearchScreen}
        options={{ title: 'Rechercher une course' }}
      />
      <Stack.Screen
        name="CourseForm"
        component={CourseFormScreen}
        options={{ title: 'Créer une course' }}
      />
      <Stack.Screen
        name="RecordMessage"
        component={RecordMessageScreen}
        options={{ title: 'Envoyer un message vocal' }}
      />
    </Stack.Navigator>
  );
}
