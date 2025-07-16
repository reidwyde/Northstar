import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  Node,
  DrawerParamList,
  DependencyRanks,
  Quest,
  Waypoint,
} from '../lib/types';
import { DataService } from '../services/data.service';

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
  // Use route params as single source of truth for current quest
  const currentQuestIdx = route.params?.questIdx || 0;
  const [quests, setQuests] = useState<Quest[]>([]);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [showWaypointEditPanel, setShowWaypointEditPanel] = useState(false);
  const [loading, setLoading] = useState(true);

  const translateX = useRef(new Animated.Value(0)).current;
  const isTransitioning = useRef(false);

  // Load quests on component mount
  useEffect(() => {
    const loadQuests = async () => {
      try {
        console.log('Loading quests...');
        const questsData = await DataService.getQuests();
        console.log('Loaded quests:', questsData.length, questsData.map(q => q.name));
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
  }, []); // Only load once on mount

  // Update waypoints when quest changes
  useEffect(() => {
    const loadWaypointsForQuest = async () => {
      if (quests.length > 0 && quests[currentQuestIdx]) {
        try {
          const questWaypoints = await DataService.getWaypointsByQuestId(quests[currentQuestIdx].id);
          setWaypoints(questWaypoints);
        } catch (error) {
          console.error('Error loading waypoints for quest:', error);
          setWaypoints([]);
        }
      }
    };

    loadWaypointsForQuest();
  }, [currentQuestIdx, quests]);

  // Update navigation title when quest changes
  useEffect(() => {
    console.log('nav', quests.length,quests[currentQuestIdx])
    if (quests.length > 0 && quests[currentQuestIdx].name) {
      console.log('name',quests[currentQuestIdx].name)
      navigation.setOptions({
        title: quests[currentQuestIdx]?.name,
      });
    }
  }, [currentQuestIdx, quests, navigation]);

  // Create PanResponder that updates with current quest data
  const panResponder = useMemo(() => 
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only capture horizontal swipes, let vertical and small movements through
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow movement if not currently transitioning
        if (!isTransitioning.current) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isTransitioning.current) return;

        console.log('Swipe detected:', gestureState.dx, 'threshold:', width * 0.3);
        console.log('Current quest idx:', currentQuestIdx, 'Total quests:', quests.length);
        console.log('Quest names:', quests.map(q => q.name));
        
        // Don't try to navigate if no quests are loaded
        if (quests.length === 0) {
          console.log('No quests loaded, ignoring swipe');
          return;
        }

        const threshold = width * 0.3; // Swipe 30% to trigger transition
        if (gestureState.dx > threshold) {
          // Swipe right - go to previous quest
          isTransitioning.current = true;
          const newIdx = (currentQuestIdx - 1 + quests.length) % quests.length;
          console.log('Swiping right to quest:', newIdx, quests[newIdx]?.name);
          Animated.timing(translateX, {
            toValue: width,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            navigation.setParams({ questIdx: newIdx });
            translateX.setValue(0);
            isTransitioning.current = false;
          });
        } else if (gestureState.dx < -threshold) {
          // Swipe left - go to next quest
          isTransitioning.current = true;
          const newIdx = (currentQuestIdx + 1) % quests.length;
          console.log('Swiping left to quest:', newIdx, quests[newIdx]?.name);
          Animated.timing(translateX, {
            toValue: -width,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            navigation.setParams({ questIdx: newIdx });
            translateX.setValue(0);
            isTransitioning.current = false;
          });
        } else {
          // Snap back if swipe not far enough
          console.log('Swipe not far enough, snapping back');
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  [currentQuestIdx, quests, navigation, width, translateX]); // Recreate when dependencies change

  const addWaypoint = () => {
    console.log('todo add waypoint');
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


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTransitioning.current || quests.length === 0) return;

      if (event.key === 'ArrowLeft') {
        // Go to previous quest
        isTransitioning.current = true;
        const newIdx = (currentQuestIdx - 1 + quests.length) % quests.length;
        Animated.timing(translateX, {
          toValue: width,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          navigation.setParams({ questIdx: newIdx });
          translateX.setValue(0);
          isTransitioning.current = false;
        });
      } else if (event.key === 'ArrowRight') {
        // Go to next quest
        isTransitioning.current = true;
        const newIdx = (currentQuestIdx + 1) % quests.length;
        Animated.timing(translateX, {
          toValue: -width,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          navigation.setParams({ questIdx: newIdx });
          translateX.setValue(0);
          isTransitioning.current = false;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentQuestIdx, quests, navigation, width, translateX]);

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
  return (
    <View style={styles.container}>
      <View
        id="wayPointView"
        {...panResponder.panHandlers}
          style={{
                  flex: 1, //so it takes up available space above the panel
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',    
                  alignItems: 'center',  
                }}
      >     
        {renderConstellation(quests[prevIdx], -width)}
        {renderConstellation(quests[currentQuestIdx], 0)}
        {renderConstellation(quests[nextIdx], width)}
      </View>
      {showWaypointEditPanel && (
        <WaypointEditPanel waypoints={waypoints} setWaypoints={setWaypoints} />
      )}

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
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 15,
            margin: 12,
          }}
        >
          <View style={{ width: 80 }}>
            <Button color="#225c6e" title="Add" onPress={addWaypoint} />
          </View>
          <View style={{ width: 80 }}>
            <Button
              color="#225c6e"
              title="Edit"
              onPress={() => setShowWaypointEditPanel(!showWaypointEditPanel)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default QuestConstellationScreen;
