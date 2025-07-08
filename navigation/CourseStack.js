import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CourseDetailScreen from '../screens/CourseDetailScreen';

const Stack = createStackNavigator();
export default function CourseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown:false }}>
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
    </Stack.Navigator>
  );
}