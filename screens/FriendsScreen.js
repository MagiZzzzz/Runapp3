// File: screens/FriendsScreen.js

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

// Données exemples
const FRIENDS = [
  {
    id: '1',
    name: 'Marie Dubois',
    pseudo: 'marie_runner',
    online: true,
    avatar: require('../assets/avatars/marie.jpg'),
    courses: [
      {
        id: 'c1',
        title: 'Marathon de Paris',
        totalDistance: '42 km',
        currentDistance: '15,2 km',
        elapsedTime: '1h23m',
        live: true,
      },
      {
        id: 'c2',
        title: 'Semi-Marathon de Paris',
        totalDistance: '21 km',
        live: false,
      },
    ],
  },
  {
    id: '2',
    name: 'Paul Martin',
    pseudo: 'paul75',
    online: true,
    avatar: require('../assets/avatars/paul.jpg'),
    courses: [
      {
        id: 'c3',
        title: 'Trail des Alpes',
        totalDistance: '30 km',
        live: true,
        currentDistance: '12,4 km',
        elapsedTime: '0h58m',
      },
      {
        id: 'c4',
        title: 'Ultra Trail 50K',
        totalDistance: '50 km',
        live: false,
      },
    ],
  },
  {
    id: '3',
    name: 'Sophie Durand',
    pseudo: 'sophie_run',
    online: false,
    avatar: require('../assets/avatars/sophie.jpg'),
    courses: [
      {
        id: 'c5',
        title: '10 km de Rennes',
        totalDistance: '10 km',
        live: false,
      },
    ],
  },
];

export default function FriendsScreen({ navigation }) {
  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={FRIENDS}
      keyExtractor={u => u.id}
      renderItem={({ item: user }) => (
        <View style={styles.userCard}>
          {/* Entête utilisateur */}
          <View style={styles.userHeader}>
            <Image source={user.avatar} style={styles.avatar} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.pseudo}>@{user.pseudo}</Text>
              <Text style={user.online ? styles.online : styles.offline}>
                {user.online ? '• Connecté' : '• Hors ligne'}
              </Text>
            </View>
          </View>

          {/* Pour chaque course, on affiche une "mini-carte" */}
          {user.courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={() =>
                navigation.navigate('RecordMessage', {
                  friend: user,
                  course
                })
              }
            />
          ))}
        </View>
      )}
    />
  );
}

// Composant dédié pour la carte d'une course
function CourseCard({ course, onPress }) {
  // Badge "EN DIRECT" clignotant
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!course.live) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true
        }),
      ])
    ).start();
  }, [course.live, opacity]);

  return (
    <View style={[
      styles.courseCard,
      course.live ? styles.liveBorder : styles.upcomingBorder
    ]}>
      <View style={styles.courseInfo}>
        <View style={{ flex: 1 }}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseMeta}>📏 {course.totalDistance}</Text>
          {course.live && (
            <Text style={styles.courseMeta}>
              ⏱️ {course.elapsedTime} — ▶️ {course.currentDistance}
            </Text>
          )}
        </View>
        {course.live && (
          <Animated.Text style={[styles.liveBadge, { opacity }]}>
            EN DIRECT
          </Animated.Text>
        )}
      </View>
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[
            styles.btn,
            course.live ? styles.btnLive : styles.btnUpcoming
          ]}
          onPress={onPress}
        >
          <Text style={styles.btnText}>
            {course.live
              ? 'Encourager maintenant'
              : 'Envoyer un message vocal'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    backgroundColor: '#f6f9fb'
  },
  userCard: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ececec'
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#22325c'
  },
  pseudo: {
    fontSize: 13,
    color: '#656d81'
  },
  online: {
    color: '#38a169',
    fontSize: 12,
    marginTop: 2
  },
  offline: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 2
  },

  /* --- CourseCard --- */
  courseCard: {
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  liveBorder: {
    borderColor: '#fc444a',
    backgroundColor: '#fff4f4',
  },
  upcomingBorder: {
    borderColor: '#22c55e',
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334082',
    marginBottom: 4,
  },
  courseMeta: {
    fontSize: 13,
    color: '#22325c',
    marginBottom: 2,
  },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#fc444a',
    color: '#fff',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 8,
  },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnLive: {
    backgroundColor: '#fc444a',
  },
  btnUpcoming: {
    backgroundColor: '#22c55e',
  },
  btnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
