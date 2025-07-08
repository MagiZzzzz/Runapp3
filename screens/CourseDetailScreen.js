import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import InfoBox from '../components/InfoBox';

export default function CourseDetailScreen(){
  return (<View style={{flex:1}}><Header title="Marathon de Paris"/><ScrollView contentContainerStyle={styles.content}><Text>Stats & Messages programmés</Text></ScrollView></View>);
}
const styles=StyleSheet.create({content:{padding:16}});