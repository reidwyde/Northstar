import React, { useState, useEffect } from 'react';
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
import { DataService, Quest } from '../services/data.service';

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
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [, forceUpdate] = useState({});
  
  const currentRouteName = state.routeNames[state.index];
  const currentRoute = state.routes[state.index];
  const currentQuestIdx = currentRoute?.params?.questIdx;
  
  // Debug drawer highlighting
  console.log('Drawer render - Current route:', currentRouteName, 'Quest idx:', currentQuestIdx);

  // Add navigation listener to force re-render when route changes
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      // Force component to re-render when navigation state changes
      forceUpdate({});
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const loadQuests = async () => {
      try {
        const questsData = await DataService.getQuests();
        setQuests(questsData);
      } catch (error) {
        console.error('Error loading quests in drawer:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuests();
  }, []);

  const navigateToScreen = (screenName: string, params?: any) => {
    navigation.navigate(screenName, params);
  };

  const navigateToQuest = (questName: string, questIdx: number) => {
    console.log('Drawer navigation to quest:', questName, 'idx:', questIdx);
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
              {loading ? (
                <Text style={styles.questItemText}>Loading quests...</Text>
              ) : (
                quests.map((quest, questIdx) => {
                  // Check if this quest is active by comparing the route name only
                  // since questIdx in params might not match array index
                  const isActive = currentRouteName === quest.name;
                  return (
                    <TouchableOpacity
                      key={quest.id}
                      style={[
                        styles.questItem,
                        isActive && styles.activeQuestItem,
                      ]}
                      onPress={() => navigateToQuest(quest.name, questIdx)}
                    >
                      <Text
                        style={[
                          styles.questItemText,
                          isActive && styles.activeQuestItemText,
                        ]}
                      >
                        {quest.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;