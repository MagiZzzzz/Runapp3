// File: screens/RecordMessageScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import decodePolyline from '../utils/decodePolyline';
import { supabase } from '../services/supabase';

// Helper pour vérifier un UUID
function isUuid(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// Chargement conditionnel de react-native-maps
let MapView = null;
let Polyline = null;
if (Platform.OS !== 'web') {
  const RNM = require('react-native-maps');
  MapView = RNM.MapView;
  Polyline = RNM.Polyline;
}

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const SUPABASE_URL = 'https://irvcovkqdcoccswcxdpz.supabase.co';

export default function RecordMessageScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const friend = route.params?.friend;
  const course = route.params?.course;

  useEffect(() => {
    if (!friend || !course) navigation.goBack();
  }, [friend, course]);

  // Décodage du tracé pour la carte si course.live
  const pathCoords =
    course?.live && course.map?.summary_polyline
      ? decodePolyline(course.map.summary_polyline)
      : [];

  const initialRegion =
    pathCoords.length > 0
      ? {
          latitude: pathCoords[0].latitude,
          longitude: pathCoords[0].longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      : {
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };

  // États audio
  const [recording, setRecording] = useState(null);
  const [sound, setSound]         = useState(null);
  const [uri, setUri]             = useState(null);

  // États trigger
  const [mode, setMode]                 = useState('immediate');
  const [triggerValue, setTriggerValue] = useState('');

  const startRecording = useCallback(async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      Alert.alert('Erreur', err.message);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    setUri(recording.getURI());
    setRecording(null);
  }, [recording]);

  const playSound = useCallback(async () => {
    if (!uri) return;
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
    await sound.playAsync();
  }, [uri]);

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const sendMessage = useCallback(async () => {
    try {
      if (!uri) throw new Error('Aucun enregistrement');

      // 1) Récupère la session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) throw sessionError || new Error('Pas de session');

      // 2) Upload vers Storage
      const ext      = uri.split('.').pop();
      const fileName = `msg_${Date.now()}.${ext}`;
      const uploadUrl = `${SUPABASE_URL}/storage/v1/object/audio/${fileName}`;
      const result    = await FileSystem.uploadAsync(
        uploadUrl,
        uri,
        {
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName:  'file',
          httpMethod: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'audio/m4a',
          },
        }
      );
      if (result.status < 200 || result.status >= 300) {
        throw new Error(`Upload échoué (${result.status})`);
      }

      // 3) URL publique
      const {
        data: { publicUrl },
        error: urlError,
      } = supabase.storage.from('audio').getPublicUrl(fileName);
      if (urlError) throw urlError;

      // 4) Récupère l’utilisateur
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      // 5) Prépare l’objet à insérer
      const messageRow = {
        sender_id:     user.id,
        receiver_id:   friend.id,
        audio_url:     publicUrl,
        mode,
        trigger_value: mode === 'immediate' ? null : triggerValue,
        created_at:    new Date().toISOString(),
      };
      // N’ajoute course_id que si c’est un UUID valide
      if (isUuid(course.id)) {
        messageRow.course_id = course.id;
      }

      // 6) Insert en base
      const { error: insertError } = await supabase
        .from('messages')
        .insert([messageRow]);
      if (insertError) throw insertError;

      Alert.alert('✅ Envoyé !');
      navigation.goBack();

    } catch (err) {
      console.error('sendMessage error:', err);
      Alert.alert('Erreur', err.message);
    }
  }, [uri, mode, triggerValue, friend, course, navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#3466E8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Message à {friend?.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Titre */}
        <Text style={styles.subtitle}>
          {course?.title} {course?.live ? '· EN DIRECT' : ''}
        </Text>

        {/* Carte + tracé (mobile) */}
        {course?.live && MapView && (
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            provider={MapView.PROVIDER_GOOGLE}
          >
            <Polyline
              coordinates={pathCoords}
              strokeWidth={4}
              strokeColor="#f56c18"
            />
          </MapView>
        )}

        {/* Stats en direct */}
        {course?.live && (
          <View style={styles.liveInfo}>
            <Text style={styles.infoText}>
              ⏱ {course.elapsedTime || '–'}   ▶️ {course.currentDistance || '–'}
            </Text>
          </View>
        )}

        {/* Enregistreur */}
        <View style={styles.recorder}>
          {!recording ? (
            <TouchableOpacity style={styles.btnRecord} onPress={startRecording}>
              <Ionicons name="mic" size={28} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.btnStop} onPress={stopRecording}>
              <Ionicons name="stop" size={28} color="#fff" />
            </TouchableOpacity>
          )}
          {uri && (
            <TouchableOpacity style={styles.btnPlay} onPress={playSound}>
              <Ionicons name="play" size={28} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Choix du mode */}
        <Text style={styles.sectionHeader}>Quand envoyer ?</Text>
        {['immediate', 'distance', 'time'].map((m) => (
          <TouchableOpacity
            key={m}
            style={[
              styles.modeBtn,
              mode === m && styles.modeBtnActive,
            ]}
            onPress={() => setMode(m)}
          >
            <Text style={mode === m ? styles.modeTextActive : styles.modeText}>
              {m === 'immediate'
                ? 'Immédiatement'
                : m === 'distance'
                ? 'À distance (km)'
                : 'À un moment (min)'}
            </Text>
          </TouchableOpacity>
        ))}
        {mode !== 'immediate' && (
          <TextInput
            placeholder={mode === 'distance' ? 'ex: 5' : 'ex: 10'}
            keyboardType="numeric"
            value={triggerValue}
            onChangeText={setTriggerValue}
            style={styles.input}
          />
        )}

        {/* Envoyer */}
        <TouchableOpacity
          style={[styles.sendBtn, !uri && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!uri}
        >
          <Text style={styles.sendText}>Envoyer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: '#fff' },
  header:     {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle:{ marginLeft: 12, fontSize: 18, fontWeight: '600' },
  content:    { padding: 16 },
  subtitle:   { fontSize: 16, color: '#555', marginBottom: 12 },
  map:        {
    width: WINDOW_WIDTH - 32,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  liveInfo:   { marginBottom: 16, alignItems: 'center' },
  infoText:   { fontSize: 14, color: '#333' },

  recorder:   {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  btnRecord:  {
    width: 64, height: 64,
    borderRadius: 32,
    backgroundColor: '#3466E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnStop:    {
    width: 64, height: 64,
    borderRadius: 32,
    backgroundColor: '#D93025',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPlay:    {
    width: 64, height: 64,
    borderRadius: 32,
    backgroundColor: '#3563E9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionHeader:   { fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 8 },
  modeBtn:         {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 4,
  },
  modeBtnActive:   { backgroundColor: '#E8F0FE', borderColor: '#3466E8' },
  modeText:        { color: '#555' },
  modeTextActive:  { color: '#3466E8', fontWeight: '600' },

  input:           {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginVertical: 12,
  },

  sendBtn:         {
    padding: 14,
    backgroundColor: '#2EB82E',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendText:        { color: '#fff', fontWeight: '600', fontSize: 16 },
});
