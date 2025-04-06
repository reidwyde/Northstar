import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerParamList } from '../lib/types';

import { quests } from '../data/quests';

import QuestConstellationScreen from '../screens/QuestConstellationScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function App() {
  return (
    <Drawer.Navigator>
      {quests.map((quest, questIdx) => (
        <Drawer.Screen
          name={quest.name}
          component={QuestConstellationScreen}
          initialParams={{ questIdx }}
          key={quest.name}
        />
      ))}
    </Drawer.Navigator>
  );
}
