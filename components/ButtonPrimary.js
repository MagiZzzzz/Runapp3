import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
export default function ButtonPrimary({title,onPress}){
  return(<TouchableOpacity style={styles.btn} onPress={onPress}><Text style={styles.txt}>{title}</Text></TouchableOpacity>);
}
const styles=StyleSheet.create({btn:{backgroundColor:'#3563E9',padding:12,borderRadius:6,marginVertical:4,alignItems:'center'},txt:{color:'#fff',fontWeight:'600'}});
