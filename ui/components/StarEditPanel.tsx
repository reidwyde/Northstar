import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import {
  createDrawerNavigator,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import {
  QuestConstellationScreenProps,
  Star,
  Quest,
  Node,
  DrawerParamList,
  DependencyRanks,
} from '../lib/types';
import { quests } from '../data/quests';
import { getColumns, getDependencyRank } from '../lib/utils';

import ConstellationView from '../components/ConstellationView';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeContainer: {
    flex: 1,
    width,
    height,
    overflow: 'hidden',
  },
  constellationContainer: {
    position: 'absolute',
    width,
    height,
  },
  graph: {
    flex: 1,
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.4,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 10,
  },
  panelText: {
    fontSize: 18,
    color: '#333',
  },
});

const StarEditPanel = ({
  stars,
  setStars,
}: {
  stars: Star[];
  setStars: (stars: Star[]) => void;
}) => {
  const [editingStar, setEditingStar] = useState<Star | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const saveChanges = () => {
    if (editingStar) {
      setStars(
        stars.map((star) =>
          star.id === editingStar.id ? { ...star, name, description } : star,
        ),
      );
      setEditingStar(null);
    }
  };

  const completeTask = () => {
    if (editingStar) {
      setStars(
        stars.map((star) =>
          star.id === editingStar.id ? { ...star, completed: true } : star,
        ),
      );
      setEditingStar(null);
    }
  };

  return (
    <View style={styles.panel}>
      {!editingStar ? (
        stars
          .filter((star) => star.selected)
          .map((star) => (
            <TouchableOpacity
              key={star.id}
              onPress={() => setEditingStar(star)}
            >
              <Text style={styles.panelText}>
                {`ID: ${star.id} Name: ${star.name || 'Unnamed'} Description: ${star.description}`}
              </Text>
            </TouchableOpacity>
          ))
      ) : (
        <>
          <TextInput
            placeholder="Enter name"
            value={name}
            onChangeText={(text) => setName(text)}
            style={[styles.panelText, { width: '100%' }]}
          />
          <TextInput
            placeholder="Enter description"
            value={description}
            onChangeText={(text) => setDescription(text)}
            style={[styles.panelText, { width: '100%' }]}
          />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button title="Edit" onPress={() => setEditingStar(null)} />
            <Button title="Complete" onPress={completeTask} />
            <Button title="Save" onPress={saveChanges} />
          </View>
        </>
      )}
    </View>
  );
};

export default StarEditPanel;
