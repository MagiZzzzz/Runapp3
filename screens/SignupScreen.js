import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';
import TextDivider from '../components/TextDivider';
import ButtonPrimary from '../components/ButtonPrimary';

const { width } = Dimensions.get('window');

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <LinearGradient colors={["#5E4CE6", "#7F5AF0"]} style={styles.bg}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Inscris-toi pour encourager tes amis coureurs</Text>

        <TouchableOpacity style={styles.stravaBtn} activeOpacity={0.8} onPress={() => { /* TODO: Strava OAuth */ }}>
          <MaterialIcons name="link" size={20} color="#fff" />
          <Text style={styles.stravaText}>Se connecter avec Strava</Text>
        </TouchableOpacity>

        <TextDivider text="ou" />

        <View style={styles.form}>
          <TextInput
            placeholder="votre@email.com"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <ButtonPrimary title="Créer un compte" onPress={signUp} />
          <TouchableOpacity style={styles.linkSignup} onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>
              Déjà un compte ? <Text style={styles.linkHighlight}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginTop: 40 },
  subtitle: { fontSize: 14, color: '#444', textAlign: 'center', marginVertical: 16 },
  stravaBtn: {
    flexDirection: 'row',
    backgroundColor: '#FF6200',
    width: width * 0.8,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20
  },
  stravaText: { color: '#fff', fontWeight: '600', marginLeft: 8 },
  form: { width: width * 0.8, alignItems: 'center' },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  linkSignup: { marginTop: 12 },
  linkText: { color: '#666' },
  linkHighlight: { color: '#3563E9', fontWeight: '500' }
});
