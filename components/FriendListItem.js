import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FriendListItem({ friend }) {
  return (
    <View style={styles.item}>
      <Text>{friend.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { padding:12, borderBottomWidth:1, borderColor:'#eee' }
});
