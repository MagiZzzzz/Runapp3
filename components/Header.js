import React from 'react';import { View, Text, StyleSheet } from 'react-native';
export default function Header({title}){return(<View style={styles.header}><Text style={styles.title}>{title}</Text></View>);}const styles=StyleSheet.create({header:{padding:16,backgroundColor:'#7F5AF0'},title:{fontSize:20,fontWeight:'bold',color:'#fff'}});
