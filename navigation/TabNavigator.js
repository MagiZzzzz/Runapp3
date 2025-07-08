// navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons }            from '@expo/vector-icons';

import HomeStackNavigator      from './HomeStackNavigator';
import FriendsStackNavigator   from './FriendsStackNavigator';
import MessagesStackNavigator  from './MessagesStackNavigator';
import SettingsStackNavigator  from './SettingsStackNavigator';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown:        false,
        tabBarActiveTintColor:   '#3466E8',
        tabBarInactiveTintColor: '#999',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Accueil':    iconName = 'home';     break;
            case 'Amis':       iconName = 'people';   break;
            case 'Messages':   iconName = 'chat';     break;
            case 'Paramètres': iconName = 'settings'; break;
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Accueil"    component={HomeStackNavigator}    />
      <Tab.Screen name="Amis"       component={FriendsStackNavigator} />
      <Tab.Screen name="Messages"   component={MessagesStackNavigator}/>
      <Tab.Screen name="Paramètres" component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
}
