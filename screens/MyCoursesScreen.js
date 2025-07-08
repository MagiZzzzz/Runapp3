// screens/MyCoursesScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList,
  TouchableOpacity, StyleSheet,
} from 'react-native';
import { supabase } from '../services/supabase';

export default function MyCoursesScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // 1) Récupère l'utilisateur connecté
      const { data:{ session } } = await supabase.auth.getSession();
      if (!session) return;

      // 2) Récupère les participations + détail course
      const { data, error } = await supabase
        .from('course_participants')
        .select(`
          joined_at,
          courses (
            id, title, total_distance
          )
        `)
        .eq('user_id', session.user.id)
        .order('joined_at', { ascending: false });

      if (error) console.error(error);
      else         setCourses(data);
      setLoading(false);
    })();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>{item.courses.title}</Text>
        <Text style={styles.meta}>Distance : {item.courses.total_distance} km</Text>
        <Text style={styles.meta}>
          Rejoint le {new Date(item.joined_at).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.joinBtn}
        onPress={()=>navigation.navigate('JoinCourse')}
      >
        <Text style={styles.joinBtnText}>➕ Je participe à une course</Text>
      </TouchableOpacity>

      {loading
        ? <Text style={styles.loading}>Chargement…</Text>
        : <FlatList
            data={courses}
            keyExtractor={i=>i.courses.id}
            renderItem={renderItem}
            ItemSeparatorComponent={()=> <View style={styles.sep}/> }
          />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex:1, padding:16, backgroundColor:'#fff' },
  joinBtn:    {
    backgroundColor:'#3466E8',
    padding:12, borderRadius:8,
    marginBottom:16, alignItems:'center'
  },
  joinBtnText:{ color:'#fff', fontWeight:'600' },
  loading:    { textAlign:'center', marginTop:20 },
  sep:        { height:12 },
  card:       {
    padding:16, backgroundColor:'#f9f9f9',
    borderRadius:8, elevation:1
  },
  info:       { },
  title:      { fontSize:16, fontWeight:'600' },
  meta:       { color:'#555', marginTop:4 }
});
