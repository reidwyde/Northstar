import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { DrawerParamList } from '../lib/types';

import { DataService, Quest } from '../services/data.service';

import QuestConstellationScreen from '../screens/QuestConstellationScreen';
import WaypointsScreen from '../screens/WaypointsScreen';
import CustomDrawerContent from '../navigation/CustomDrawerContent';

const Drawer = createDrawerNavigator<DrawerParamList>();

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingText}>Loading application...</Text>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
});

export default function App() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Preload all data
        await DataService.preloadAllData();
        const questsData = await DataService.getQuests();
        setQuests(questsData);
      } catch (error) {
        console.error('Error loading application data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#111' },
        headerTintColor: 'white',
        drawerStyle: { backgroundColor: '#222' },
      }}
    >
      <Drawer.Screen
        name="Waypoints"
        component={WaypointsScreen}
        options={{ drawerLabel: 'Waypoints' }}
      />
      {quests.map((quest, questIdx) => (
        <Drawer.Screen
          name={quest.name}
          component={QuestConstellationScreen}
          initialParams={{ questIdx }}
          key={quest.id}
          options={{ drawerItemStyle: { display: 'none' } }} // Hide from default drawer
        />
      ))}
    </Drawer.Navigator>
  );
}
