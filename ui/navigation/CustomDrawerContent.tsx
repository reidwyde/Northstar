import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { quests } from '../data/quests';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  drawerItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  drawerItemText: {
    color: 'white',
    fontSize: 16,
  },
  activeDrawerItem: {
    backgroundColor: '#444',
  },
  activeDrawerItemText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  questsSection: {
    marginTop: 10,
  },
  questsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#333',
  },
  questsSectionHeaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  expandIcon: {
    color: 'white',
    fontSize: 16,
  },
  questItem: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  questItemText: {
    color: '#ccc',
    fontSize: 14,
  },
  activeQuestItem: {
    backgroundColor: '#3a3a3a',
  },
  activeQuestItemText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { navigation, state } = props;
  const [questsExpanded, setQuestsExpanded] = useState(false);
  
  const currentRouteName = state.routeNames[state.index];

  const navigateToScreen = (screenName: string, params?: any) => {
    navigation.navigate(screenName, params);
  };

  const navigateToQuest = (questName: string, questIdx: number) => {
    navigation.navigate(questName, { questIdx });
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <ScrollView>
        {/* Waypoints */}
        <TouchableOpacity
          style={[
            styles.drawerItem,
            currentRouteName === 'Waypoints' && styles.activeDrawerItem,
          ]}
          onPress={() => navigateToScreen('Waypoints')}
        >
          <Text
            style={[
              styles.drawerItemText,
              currentRouteName === 'Waypoints' && styles.activeDrawerItemText,
            ]}
          >
            Waypoints
          </Text>
        </TouchableOpacity>

        {/* Quests Section */}
        <View style={styles.questsSection}>
          <TouchableOpacity
            style={styles.questsSectionHeader}
            onPress={() => setQuestsExpanded(!questsExpanded)}
          >
            <Text style={styles.questsSectionHeaderText}>Quests</Text>
            <Text style={styles.expandIcon}>
              {questsExpanded ? '−' : '+'}
            </Text>
          </TouchableOpacity>
          
          {questsExpanded && (
            <View>
              {quests.map((quest, questIdx) => (
                <TouchableOpacity
                  key={quest.name}
                  style={[
                    styles.questItem,
                    currentRouteName === quest.name && styles.activeQuestItem,
                  ]}
                  onPress={() => navigateToQuest(quest.name, questIdx)}
                >
                  <Text
                    style={[
                      styles.questItemText,
                      currentRouteName === quest.name && styles.activeQuestItemText,
                    ]}
                  >
                    {quest.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;