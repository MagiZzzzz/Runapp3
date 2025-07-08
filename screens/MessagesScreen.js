// File: screens/MessagesScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../services/supabase';

export default function MessagesScreen() {
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      const { data, error } = await supabase
        .from('messages')
        .select(`id, sender_id, receiver_id, course_id, audio_url, mode, trigger_value, created_at`)
        .order('created_at', { ascending: false });
      if (error) console.error(error);
      else setMsgs(data);
    }
    fetchMessages();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={msgs}
        keyExtractor={m => m.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.meta}>
              De: {item.sender_id} → À: {item.receiver_id}
            </Text>
            <Text>{item.mode}{item.trigger_value ? ` à ${item.trigger_value}` : ''}</Text>
            <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
            <Text style={styles.link} onPress={() => {/* play item.audio_url */}}>
              ▶️ Écouter
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16 },
  row:       { marginBottom:16, borderBottomWidth:1, borderColor:'#eee', paddingBottom:8 },
  meta:      { fontSize:12, color:'#666' },
  date:      { fontSize:12, color:'#999', marginTop:4 },
  link:      { color:'#3466E8', marginTop:6 }
});
