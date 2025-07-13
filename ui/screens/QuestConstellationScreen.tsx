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

import { DataService, Quest as DataQuest } from '../services/data.service';

import ConstellationView from '../components/ConstellationView';
import WaypointEditPanel from '../components/WaypointEditPanel';
import { FlatList } from 'react-native';

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
    position: 'relative',
    width: '100%',
    height: '100%',
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
  const [quests, setQuests] = useState<DataQuest[]>([]);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [showWaypointEditPanel, setShowWaypointEditPanel] = useState(false);
  const [loading, setLoading] = useState(true);

  const translateX = useRef(new Animated.Value(0)).current;
  const isTransitioning = useRef(false);

  // Load quests on component mount
  useEffect(() => {
    const loadQuests = async () => {
      try {
        const questsData = await DataService.getQuests();
        setQuests(questsData);
        if (questsData.length > 0 && questsData[currentQuestIdx]) {
          // For now, use empty waypoints since we need to update mapQuestToWaypoints
          setWaypoints([]);
        }
      } catch (error) {
        console.error('Error loading quests in constellation screen:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuests();
  }, []);

  // Update waypoints when quest changes
  useEffect(() => {
    if (quests.length > 0 && quests[currentQuestIdx]) {
      // For now, use empty waypoints since we need to update mapQuestToWaypoints
      setWaypoints([]);
    }
  }, [currentQuestIdx, quests]);

  // Add this effect to update navigation when currentQuestIdx changes
  useEffect(() => {
    if (quests.length > 0 && currentQuestIdx !== initialQuestIdx && quests[currentQuestIdx]) {
      navigation.navigate(quests[currentQuestIdx].name, {
        questIdx: currentQuestIdx,
      });
    }
  }, [currentQuestIdx, initialQuestIdx, navigation, quests]);

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
      id = 'animatedView'
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

  //   const renderConstellation = (quest: Quest, offset: number) => (
  //   <View
  //   >
  //     <ConstellationView quest={quest} waypoints={waypoints} setWaypoints={setWaypoints} />
  //   </View>
  // );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.panelText}>Loading quest...</Text>
      </View>
    );
  }

  if (quests.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.panelText}>No quests available</Text>
      </View>
    );
  }

  const prevIdx = (currentQuestIdx - 1 + quests.length) % quests.length;
  const nextIdx = (currentQuestIdx + 1) % quests.length;
{console.log('quests', quests)}
  return (
    <View style={styles.container}>
      {/* Add flex: 1 to wayPointView so it takes up available space above the panel */}
      <View
        id="wayPointView"
        {...panResponder.panHandlers}
          style={{
                  flex: 1,
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',    // Center vertically
                  alignItems: 'center',  
                }}
      >
        
        {renderConstellation(quests[prevIdx], -width)}
        {renderConstellation(quests[currentQuestIdx], 0)}
        {renderConstellation(quests[nextIdx], width)}
      </View>

          {/* Horizontally scrollable constellation views */}
    {/* <View
      id="wayPointView"
      style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <FlatList
        data={
          quests
        }
        keyExtractor={(_, idx) => idx.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={true}
        renderItem={({ item, index }) =>
          renderConstellation(
            item,
            width // offset: -width, 0, width
          )
        }
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </View> */}

      {showWaypointEditPanel && (
        <WaypointEditPanel waypoints={waypoints} setWaypoints={setWaypoints} />
      )}

      {/* Panel stays at the bottom */}
      <View
        id="wayPointPanel"
        style={{
          marginBottom: 24,
          borderWidth: 1,
          borderColor: '#0a1a24',
          borderRadius: 4,
          width: '98%',
          backgroundColor: '#183e54',
          alignSelf: 'center',
        }}
      >
        <View
          style={{
            width: '20%',
            minWidth: 80,
            margin: 24,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <Button color="#225c6e" title="Add Node" onPress={addNode} />
        </View>

        <View
          style={{
            width: '20%',
            minWidth: 80,
            margin: 24,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <Button
            color="#225c6e"
            title="Toggle Edit Panel"
            onPress={() => setShowWaypointEditPanel(!showWaypointEditPanel)}
          />
        </View>
      </View>
    </View>
  );
};

export default QuestConstellationScreen;
