import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import type {Quest} from './graphTypes';

const QuestList = (
  { 
    quests=[]
  }:{
    quests: Quest[]; 
  }) => {
  const renderItem = ({ item }) => (
    <View style={styles.questItem}>
      <Text style={styles.text}>{item.text}</Text>
      <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <FlatList
      data={quests}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  questItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
});


export default QuestList;

