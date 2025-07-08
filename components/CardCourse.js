import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CardCourse({ course }) {
  return (
    <View style={styles.card}>
      {course.live && <Text style={styles.liveBadge}>EN DIRECT</Text>}
      <Text style={styles.title}>{course.title}</Text>
      <Text>📅 {course.date}</Text>
      <Text>📍 {course.location}</Text>
      <Text>🏃‍♂️ Distance: {course.distance}</Text>
      <Text>👥 Participants: {course.participants.toLocaleString()}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.btnText}>Enregistrer un message pour cette course</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor:'#fff', borderRadius:8, padding:16, marginBottom:16, shadowColor:'#000', shadowOpacity:0.1, shadowRadius:4 },
  liveBadge: { color:'#E53E3E', fontWeight:'bold', marginBottom:8 },
  title: { fontSize:18, fontWeight:'bold', marginBottom:4 },
  button: { marginTop:12, backgroundColor:'#3563E9', padding:12, borderRadius:6, alignItems:'center' },
  btnText: { color:'#fff', fontWeight:'600' }
});
