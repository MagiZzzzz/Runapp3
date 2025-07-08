import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { supabase } from '../services/supabase'; // ⚠️ chemin à ADAPTER si besoin

const { width } = Dimensions.get('window');

// STRAVA OAUTH
const STRAVA_CLIENT_ID     = '167142';
const STRAVA_CLIENT_SECRET = 'c418558a5796bf9a74dc2d3fd756da3cb0c13967';

const REDIRECT_URI = AuthSession.makeRedirectUri({
  useProxy: true,
  // Si build : remplace par scheme: 'voicerun',
});

export default function LoginScreen({ navigation }) {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false); // switch login/signup

  // Strava OAuth
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId:    STRAVA_CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes:      ['read', 'profile:read_all', 'activity:read_all'],
      usePKCE:     true,
      useProxy:    true,
    },
    {
      authorizationEndpoint: 'https://www.strava.com/oauth/authorize',
      tokenEndpoint:         'https://www.strava.com/oauth/token',
    }
  );

  // LOGS pour debug mobile
  const [logs, setLogs] = useState([]);
  function addLog(msg) {
    setLogs(l => [...l, msg]);
  }

  useEffect(() => {
    addLog('▶️ redirectUri envoyée à Strava: ' + REDIRECT_URI);
  }, []);

  // Quand Strava renvoie le code, échange pour un token
  const exchangeCodeForToken = useCallback(async (code) => {
    try {
      addLog('🔄 Exchanging Strava code…');
      const tokenRes = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id:     STRAVA_CLIENT_ID,
          client_secret: STRAVA_CLIENT_SECRET,
          code,
          grant_type:    'authorization_code',
        }),
      });
      const tokenJson = await tokenRes.json();
      addLog('↪️ Token JSON: ' + JSON.stringify(tokenJson));
      if (!tokenJson.access_token) throw new Error('Aucun access_token reçu');
      const access_token = tokenJson.access_token;

      // Profil athlète
      const athleteRes = await fetch('https://www.strava.com/api/v3/athlete', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      const athlete = await athleteRes.json();
      addLog('👤 Athlete: ' + JSON.stringify(athlete));

      // Amis
      const friendsRes = await fetch('https://www.strava.com/api/v3/athlete/following', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      const friends = await friendsRes.json();
      addLog('🤝 Friends: ' + JSON.stringify(friends));

      // Stockage dans Supabase : serialise les objets !
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (user) {
        const { error } = await supabase.auth.updateUser({
          data: {
            strava_access_token: access_token,
            strava_athlete: JSON.stringify(athlete),  // SERIALISATION
            strava_friends: JSON.stringify(friends),  // SERIALISATION
          }
        });
        if (error) throw error;
        addLog('💾 Supabase user updated!');
      }
      addLog('🚀 Redirection accueil');
      
    } catch (err) {
      addLog('🔥 exchangeCode error: ' + err.message);
      Alert.alert('Erreur Strava', err.message);
    }
  }, [navigation]);

  useEffect(() => {
    addLog('📲 OAuth response: ' + JSON.stringify(response));
    if (response?.type === 'success' && response.params.code) {
      exchangeCodeForToken(response.params.code);
    }
    if (response?.type && response?.type !== 'success') {
      addLog('❌ OAuth type: ' + response.type);
    }
  }, [response, exchangeCodeForToken]);

  // Email/MDP login
  const signIn = async () => {
    addLog('🔑 Tentative de connexion email...');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      addLog('❌ Connexion échouée: ' + error.message);
      Alert.alert('Erreur', error.message);
    } else {
      addLog('✅ Connexion réussie');
      
    }
  };

  // Email/MDP signup
  const signUp = async () => {
    addLog('👤 Création de compte...');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      addLog('❌ Création échouée: ' + error.message);
      Alert.alert('Erreur', error.message);
    } else {
      addLog('✅ Compte créé, vérifie tes mails pour valider');
      
    }
  };

  return (
    <LinearGradient colors={['#5E4CE6', '#7F5AF0']} style={styles.bg}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>VoiceRun</Text>
        <Text style={styles.subtitle}>Connecte-toi ou crée un compte Supabase, ou connecte Strava !</Text>
        <TouchableOpacity
          style={styles.stravaBtn}
          onPress={() => promptAsync()}
          disabled={!request}
        >
          <MaterialIcons name="link" size={20} color="#fff"/>
          <Text style={styles.stravaText}>Se connecter avec Strava</Text>
        </TouchableOpacity>
        <Text style={{marginVertical: 8, color:'#aaa'}}>— OU —</Text>
        <View style={styles.form}>
          <TextInput
            placeholder="votre@email.com"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#aaa"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={isSignup ? signUp : signIn}
          >
            <Text style={styles.signupText}>
              {isSignup ? "Créer un compte" : "Se connecter"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
            <Text style={styles.linkText}>
              {isSignup
                ? "Déjà un compte ? Se connecter"
                : "Pas de compte ? Créer un compte"}
            </Text>
          </TouchableOpacity>
        </View>
        {/* LOGS */}
        <ScrollView style={{maxHeight: 200, marginTop: 20, backgroundColor:'#111', padding:8, borderRadius:8}}>
          {logs.map((log, i) => (
            <Text key={i} style={{color:'#0f0', fontSize:12}}>{log}</Text>
          ))}
        </ScrollView>
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
  signupBtn: {
    marginTop: 16, backgroundColor: '#3563E9', padding: 12, borderRadius: 8, width: '100%',
    alignItems: 'center'
  },
  signupText: { color: '#fff', fontWeight: 'bold' },
  linkText: { color: '#3563E9', fontWeight: '500', marginTop: 8 }
});
