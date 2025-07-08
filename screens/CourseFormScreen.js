// File: screens/CourseFormScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import ButtonPrimary from '../components/ButtonPrimary';
import { supabase } from '../services/supabase';

export default function CourseFormScreen({ route, navigation }) {
  const initial = route.params?.initialTitle || '';
  const [title, setTitle]     = useState(initial);
  const [city, setCity]       = useState('');
  const [distance, setDistance] = useState('');

  const createAndJoin = async () => {
    if (!title.trim() || !distance.trim()) {
      return Alert.alert('Erreur', 'Le nom et la distance sont obligatoires');
    }
    try {
      // session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Vous devez être connecté');

      // création
      const { data: course, error: err1 } = await supabase
        .from('courses')
        .insert([{
          title: title.trim(),
          city: city.trim() || null,
          total_distance: parseFloat(distance),
          created_by: session.user.id,
        }])
        .select('id,title')
        .single();
      if (err1) throw err1;

      // participation
      const { error: err2 } = await supabase
        .from('course_participants')
        .insert([{
          user_id: session.user.id,
          course_id: course.id,
        }]);
      if (err2) throw err2;

      Alert.alert('✅ Cours créée', `Vous participez à ${course.title}`);
      navigation.popToTop();

    } catch (err) {
      Alert.alert('Erreur', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Créer une nouvelle course</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom de la course"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Ville (optionnel)"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="Distance (km)"
        value={distance}
        onChangeText={setDistance}
        keyboardType="numeric"
      />

      <ButtonPrimary
        title="Créer et rejoindre"
        onPress={createAndJoin}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: Platform.select({ ios: 32, android: 16 }),
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
});
