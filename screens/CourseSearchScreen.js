// File: screens/CourseSearchScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { supabase } from '../services/supabase';
import ButtonPrimary from '../components/ButtonPrimary';

export default function CourseSearchScreen({ navigation }) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, total_distance')
      .ilike('title', `%${query}%`)
      .limit(20);
    setLoading(false);
    if (error) Alert.alert('Erreur', error.message);
    else setResults(data);
  }, [query]);

  useEffect(() => {
    search();
  }, [query]);

  const joinCourse = async (course) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      Alert.alert('Erreur', 'Vous devez être connecté');
      return;
    }
    const { error } = await supabase
      .from('course_participants')
      .insert([{ user_id: session.user.id, course_id: course.id }]);
    if (error) Alert.alert('Impossible de rejoindre', error.message);
    else {
      Alert.alert('🎉 Rejoint', `Vous participez à ${course.title}`);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rechercher une course</Text>
      <TextInput
        style={styles.input}
        placeholder="Tapez au moins 2 caractères…"
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={results}
        keyExtractor={item => item.id}
        ListEmptyComponent={() =>
          !loading && query.length >= 2
            ? <Text style={styles.noRes}>Aucune course trouvée</Text>
            : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => joinCourse(item)}
          >
            <View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSub}>Distance : {item.total_distance} km</Text>
            </View>
            <Text style={styles.itemAction}>Rejoindre</Text>
          </TouchableOpacity>
        )}
      />

      {/* Bouton fixe en bas */}
      <View style={styles.footer}>
        <ButtonPrimary
          title={`Créer "${query.trim() || 'une course'}"`}
          onPress={() =>
            navigation.navigate('CourseForm', { initialTitle: query.trim() })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: Platform.select({ ios: 0, android: 8 }),
    marginHorizontal: 16,
    marginBottom: 12,
  },
  input: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,      // plus d’air à gauche/droite
    paddingVertical: 10,
    marginBottom: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,         // pour laisser la place au footer
  },
  noRes: {
    textAlign: 'center',
    color: '#999',
    marginTop: 24,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemSub: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  itemAction: {
    color: '#3466E8',
    fontWeight: '600',
    alignSelf: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
});
