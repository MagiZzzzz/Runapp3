// File: screens/HomeScreen.js
import React, { useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Animated, useWindowDimensions,
  Platform, Easing
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { MaterialIcons }     from '@expo/vector-icons';
import ButtonPrimary         from '../components/ButtonPrimary';
import CardFeature           from '../components/CardFeature';

export default function HomeScreen({ navigation }) {
  const { width: windowWidth } = useWindowDimensions();
  const H_PADDING = 16;
  const bannerWidth  = windowWidth - H_PADDING*2;
  const bannerHeight = (bannerWidth * 9)/16;

  // Animation « bulles »
  const animTL = useRef(new Animated.Value(0)).current;
  const animTR = useRef(new Animated.Value(0)).current;
  const animBL = useRef(new Animated.Value(0)).current;
  const animBR = useRef(new Animated.Value(0)).current;
  const useNative = Platform.OS !== 'web';

  useEffect(() => {
    const startLoop = (anim, toValue, delay=0) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue, duration:2000, easing:Easing.inOut(Easing.ease), useNativeDriver:useNative }),
          Animated.timing(anim, { toValue:0,     duration:2000, easing:Easing.inOut(Easing.ease), useNativeDriver:useNative }),
        ])
      ).start();
    };
    startLoop(animTL, -10,    0);
    startLoop(animTR, -10,  500);
    startLoop(animBL,  10, 1000);
    startLoop(animBR,  10, 1500);
  }, []);

  const interpolateStyle = anim => ({
    transform:[
      { translateY: anim },
      { scale: anim.interpolate({ inputRange:[-10,0,10], outputRange:[0.95,1,0.95] }) }
    ],
    opacity: anim.interpolate({ inputRange:[-10,0,10], outputRange:[0.8,1,0.8] })
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>👋 Salut Utilisateur !</Text>
      <Text style={styles.tagline}>
        Encouragez vos amis coureurs avec des messages vocaux personnalisés
      </Text>

      {/* Vidéo */}
      <View style={[styles.bannerWrapper, { width:bannerWidth, height:bannerHeight }]}>
        <Video
          source={require('../assets/video/running.mp4')}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay isLooping muted
        />
        <TouchableOpacity style={styles.playBtn}>
          <MaterialIcons name="play-circle-outline" size={48} color="#fff"/>
        </TouchableOpacity>
        <Text style={styles.overlayText}>
          Votre prochaine étape commence maintenant
        </Text>
        {/* Bulles */}
        <Animated.View style={[styles.bubble, styles.topLeft,   interpolateStyle(animTL)]}>
          <Text style={styles.bubbleText}>🏃 Marie – km 15/42</Text>
        </Animated.View>
        <Animated.View style={[styles.bubble, styles.topRight,  interpolateStyle(animTR)]}>
          <Text style={styles.bubbleText}>Paul – km 25/42</Text>
        </Animated.View>
        <Animated.View style={[styles.bubbleSmall, styles.bottomLeft, interpolateStyle(animBL)]}>
          <Text style={styles.bubbleTextSmall}>« Plus que 10 km Marie ! »</Text>
        </Animated.View>
        <Animated.View style={[styles.bubbleSmall, styles.bottomRight, interpolateStyle(animBR)]}>
          <Text style={styles.bubbleTextSmall}>« Tu es un champion Paul ! »</Text>
        </Animated.View>
      </View>

      <Text style={styles.description}>
        Suivez vos amis en temps réel pendant toutes leurs courses et envoyez-leur
        des messages d'encouragement qui arrivent directement dans leurs
        écouteurs au moment exact que vous choisissez !
      </Text>

      {/* Bouton « Je participe à une course » */}
      <ButtonPrimary
        title="Je participe à une course"
        onPress={() => navigation.navigate('CourseSearch')}
      />

      {/* Vos autres cartes de fonctionnalités */}
      <View style={styles.featuresRow}>
        <CardFeature
          icon="people"
          title="Amis coureurs"
          subtitle="Connectez-vous pour voir vos amis"
          onPress={() => navigation.navigate('Mes Amis')}
        />
        <CardFeature
          icon="mic"
          title="Messages"
          subtitle="Historique de vos envois"
          onPress={() => navigation.navigate('Messages')}
        />
        <CardFeature
          icon="emoji-events"
          title="Toutes les courses"
          subtitle="Marathons, trails…"
          onPress={() => navigation.navigate('CourseSearch')}
        />
      </View>

      {/* Actions rapides */}
      <View style={styles.btnRow}>
        <ButtonPrimary
          title="Voir mes amis"
          onPress={() => navigation.navigate('Mes Amis')}
        />
        <ButtonPrimary
          title="Mes messages (0)"
          onPress={() => navigation.navigate('Messages')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:     { padding:16, backgroundColor:'#fff' },
  greeting:      { fontSize:24, fontWeight:'bold', marginTop:24, textAlign:'center' },
  tagline:       { fontSize:14, color:'#555', textAlign:'center', marginVertical:8 },
  bannerWrapper: { borderRadius:12, overflow:'hidden', backgroundColor:'#000', marginVertical:16, alignSelf:'center' },
  video:         { width:'100%', height:'100%' },
  playBtn:       { position:'absolute', top:'50%', left:'50%', marginTop:-24, marginLeft:-24 },
  overlayText:   { position:'absolute', top:8, alignSelf:'center', backgroundColor:'rgba(0,0,0,0.4)', color:'#fff', fontWeight:'600', paddingHorizontal:10, paddingVertical:4, borderRadius:12, fontSize:14 },
  bubble:        { position:'absolute', backgroundColor:'rgba(0,0,0,0.6)', paddingHorizontal:8, paddingVertical:4, borderRadius:16 },
  bubbleSmall:   { position:'absolute', backgroundColor:'rgba(0,0,0,0.6)', paddingHorizontal:8, paddingVertical:3, borderRadius:16 },
  bubbleText:    { color:'#fff', fontWeight:'600', fontSize:12 },
  bubbleTextSmall:{ color:'#fff', fontSize:10 },
  topLeft:       { top:8, left:8 },
  topRight:      { top:8, right:8 },
  bottomLeft:    { bottom:8, left:8 },
  bottomRight:   { bottom:8, right:8 },
  description:   { fontSize:14, color:'#555', textAlign:'center', marginBottom:24 },
  featuresRow:   { flexDirection:'row', justifyContent:'space-between', marginVertical:16 },
  btnRow:        { flexDirection:'row', justifyContent:'space-between', marginBottom:24 },
});
