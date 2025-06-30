import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerParamList } from '../lib/types';

import { quests } from '../data/quests';

import QuestConstellationScreen from '../screens/QuestConstellationScreen';
import WaypointsScreen from '../screens/WaypointsScreen';
import CustomDrawerContent from '../navigation/CustomDrawerContent';

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function App() {
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
          key={quest.name}
          options={{ drawerItemStyle: { display: 'none' } }} // Hide from default drawer
        />
      ))}
    </Drawer.Navigator>
  );
}
