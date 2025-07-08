// File: screens/EditProfileScreen.js

import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TextInput,
  TouchableOpacity, ScrollView, StyleSheet, Alert, Platform,
  Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const AVATAR_SIZE = 120;

export default function EditProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [avatar, setAvatar]     = useState('https://randomuser.me/api/portraits/lego/1.jpg');
  const [firstName, setFirst]   = useState('');
  const [lastName,  setLast]    = useState('');

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission refusée', 'Accès à la galerie requis');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.cancelled) setAvatar(result.uri);
  };

  const saveProfile = () => {
    if (!firstName || !lastName) {
      Alert.alert('Champs manquants', 'Veuillez saisir votre nom et prénom');
      return;
    }
    // TODO: envoyer vers Supabase et mettre à jour le contexte utilisateur
    Alert.alert('Profil mis à jour', `${firstName} ${lastName}`);
    navigation.goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 16 }
      ]}
    >
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#3466E8" />
      </TouchableOpacity>
      <Text style={styles.title}>Modifier mon profil</Text>

      <View style={{ marginBottom: 24 }}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Prénom"
          value={firstName}
          onChangeText={setFirst}
          style={styles.input}
        />
        <TextInput
          placeholder="Nom"
          value={lastName}
          onChangeText={setLast}
          style={styles.input}
        />
        <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
          <Text style={styles.saveText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    flexGrow: 1,
  },
  back: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    color: '#22325c',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: '#eee',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 4,
    right: (width - AVATAR_SIZE) / 2 - 4, // centré sous l'avatar
    backgroundColor: '#3466E8',
    padding: 6,
    borderRadius: 16,
  },
  form: {
    width: '100%',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: '#3466E8',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
