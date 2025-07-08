import React, { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Accueil'), 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient colors={["#5E4CE6","#7F5AF0"]} style={styles.container}>
      <Text style={styles.title}>VoiceRun</Text>
      <Text style={styles.subtitle}>Encouragez vos amis coureurs</Text>
    </LinearGradient>
  );
}