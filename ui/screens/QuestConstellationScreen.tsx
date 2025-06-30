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
  Waypoint,
  Quest,
  Node,
  DrawerParamList,
  DependencyRanks,
} from '../lib/types';
import { mapQuestToWaypoints, getColumns, getDependencyRank } from '../lib/utils';

import { quests } from '../data/quests';

import ConstellationView from '../components/ConstellationView';
import WaypointEditPanel from '../components/WaypointEditPanel';

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

const QuestConstellationScreen: React.FC<
  QuestConstellationScreenProps<string>
> = ({ route, navigation }) => {
  const { questIdx: initialQuestIdx } = route.params || { questIdx: 0 };
  const [currentQuestIdx, setCurrentQuestIdx] = useState(initialQuestIdx);
  const [waypoints, setWaypoints] = useState<Waypoint[]>(
    mapQuestToWaypoints(quests[currentQuestIdx]),
  );
  const [showWaypointEditPanel, setShowWaypointEditPanel] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;
  const isTransitioning = useRef(false);

  // Update waypoints when quest changes
  useEffect(() => {
    setWaypoints(mapQuestToWaypoints(quests[currentQuestIdx]));
  }, [currentQuestIdx]);

  // Add this effect to update navigation when currentQuestIdx changes
  useEffect(() => {
    if (currentQuestIdx !== initialQuestIdx) {
      navigation.navigate(quests[currentQuestIdx].name, {
        questIdx: currentQuestIdx,
      });
    }
  }, [currentQuestIdx, initialQuestIdx, navigation]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Only allow movement if not currently transitioning
        if (!isTransitioning.current) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isTransitioning.current) return;

        const threshold = width * 0.3; // Swipe 30% to trigger transition
        if (gestureState.dx > threshold) {
          // Swipe right
          isTransitioning.current = true;
          const newIdx = (currentQuestIdx - 1 + quests.length) % quests.length;
          Animated.timing(translateX, {
            toValue: width,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setCurrentQuestIdx(newIdx);
            translateX.setValue(0);
            isTransitioning.current = false;
          });
        } else if (gestureState.dx < -threshold) {
          // Swipe left
          isTransitioning.current = true;
          const newIdx = (currentQuestIdx + 1) % quests.length;
          Animated.timing(translateX, {
            toValue: -width,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setCurrentQuestIdx(newIdx);
            translateX.setValue(0);
            isTransitioning.current = false;
          });
        } else {
          // Snap back if swipe not far enough
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const addNode = () => {
    console.log('todo add node');
  };

  const renderConstellation = (quest: Quest, offset: number) => (
    <Animated.View
      style={{
        ...styles.constellationContainer,
        transform: [
          {
            translateX: translateX.interpolate({
              inputRange: [-width, 0, width],
              outputRange: [offset - width, offset, offset + width],
            }),
          },
        ],
      }}
    >
      <ConstellationView quest={quest} waypoints={waypoints} setWaypoints={setWaypoints} />
    </Animated.View>
  );

  const prevIdx = (currentQuestIdx - 1 + quests.length) % quests.length;
  const nextIdx = (currentQuestIdx + 1) % quests.length;

  return (
    <View style={styles.container}>
      <View style={styles.swipeContainer} {...panResponder.panHandlers}>
        {renderConstellation(quests[prevIdx], -width)}
        {renderConstellation(quests[currentQuestIdx], 0)}
        {renderConstellation(quests[nextIdx], width)}
      </View>
      {showWaypointEditPanel && <WaypointEditPanel waypoints={waypoints} setWaypoints={setWaypoints} />}
      <Button title="Add Node" onPress={addNode} />
      <Button
        title="Toggle Edit Panel"
        onPress={() => setShowWaypointEditPanel(!showWaypointEditPanel)}
      />
    </View>
  );
};

export default QuestConstellationScreen;
