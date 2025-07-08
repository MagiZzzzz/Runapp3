// File: screens/SettingsScreen.js

import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  ScrollView, StyleSheet, Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

const { width } = Dimensions.get('window');

export default function SettingsScreen({ navigation }) {
  const [user, setUser] = useState({
    avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
    firstName: 'Jean',
    lastName: 'Dupont',
    sent: 0,
    received: 0,
  });

  useEffect(() => {
    // TODO: remplacer par un fetch réel Supabase
    // supabase.auth.getUser().then(...).then(u => setUser({ ... }))
    // et récupérer sent/received depuis la table message
    setUser(u => ({ ...u, sent: 12, received: 8 }));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profil */}
      <View style={styles.profileCard}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user.sent}</Text>
            <Text style={styles.statLabel}>Envoyés</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user.received}</Text>
            <Text style={styles.statLabel}>Reçus</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <MaterialIcons name="edit" size={20} color="#3466E8" />
          <Text style={styles.editBtnText}>Modifier le profil</Text>
        </TouchableOpacity>
      </View>

      {/* Réglages */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Réglages</Text>
        {[
          { icon: 'notifications', label: 'Notifications' },
          { icon: 'lock',          label: 'Confidentialité' },
          { icon: 'help-outline',  label: 'Aide & support' },
          { icon: 'logout',        label: 'Se déconnecter' },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.settingItem}>
            <MaterialIcons name={item.icon} size={22} color="#555" />
            <Text style={styles.settingText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const AVATAR_SIZE = 100;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafe',
  },
  profileCard: {
    width: width - 32,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#eee',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#22325c',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3466E8',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: '#3466E8',
    borderWidth: 1,
    borderRadius: 8,
  },
  editBtnText: {
    color: '#3466E8',
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    width: width - 32,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22325c',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 15,
    marginLeft: 12,
    color: '#333',
  },
});
