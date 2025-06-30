import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Waypoint } from '../lib/types';
import { Alert } from 'react-native';
import { SyncService } from '../services/sync.service';

const WAYPOINTS_STORAGE_KEY = 'waypoints';

export const useWaypoints = () => {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadWaypoints();
    // Sync with DynamoDB on app startup
    syncWaypoints();
  }, []);

  const syncWaypoints = async () => {
    try {
      console.log('Starting waypoints sync...');
      const result = await SyncService.syncObjectType<Waypoint>(
        'waypoint',
        WAYPOINTS_STORAGE_KEY,
        (item: any) => ({
          ...item,
          northstarObjectID: item.northstarObjectID || SyncService.generateObjectID(),
          created: new Date(item.created),
          lastModified: new Date(item.lastModified),
        } as Waypoint),
        (item: Waypoint) => item
      );
      console.log('Waypoints sync result:', result);
      // Reload waypoints after sync
      loadWaypoints();
    } catch (error) {
      console.error('Error syncing waypoints:', error);
      // Continue anyway - offline mode
    }
  };

  const loadWaypoints = async () => {
    try {
      const stored = await AsyncStorage.getItem(WAYPOINTS_STORAGE_KEY);
      if (stored) {
        const parsedWaypoints = JSON.parse(stored).map((wp: any) => ({
          ...wp,
          id: wp.id || SyncService.generateObjectID(), // Ensure unique ID
          created: new Date(wp.created || wp.dateCreated), // Handle legacy dateCreated
          lastModified: new Date(wp.lastModified || wp.created || wp.dateCreated),
          tags: wp.tags || [],
          blocks: wp.blocks || [],
          blockedBy: wp.blockedBy || [],
          northstarObjectID: wp.northstarObjectID || SyncService.generateObjectID(), // Handle legacy items
        }));

        // Check for and fix duplicate IDs
        const usedIds = new Set<string>();
        const uniqueWaypoints = parsedWaypoints.map((wp: any) => {
          if (usedIds.has(wp.id)) {
            // Generate new ID for duplicate
            const newId = SyncService.generateObjectID();
            console.warn(`Duplicate waypoint ID detected: ${wp.id}, assigning new ID: ${newId}`);
            return { ...wp, id: newId };
          }
          usedIds.add(wp.id);
          return wp;
        });

        setWaypoints(uniqueWaypoints);
      }
    } catch (error) {
      console.error('Error loading waypoints:', error);
    }
  };

  const saveWaypoints = async (waypointsToSave: Waypoint[]) => {
    try {
      await AsyncStorage.setItem(WAYPOINTS_STORAGE_KEY, JSON.stringify(waypointsToSave));
    } catch (error) {
      console.error('Error saving waypoints:', error);
    }
  };

  const addWaypoint = async (text: string, description: string, tagsString: string) => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter waypoint text');
      return false;
    }

    const now = new Date();
    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    const newWaypoint: Waypoint = {
      id: SyncService.generateObjectID(), // Use UUID instead of timestamp
      northstarObjectID: SyncService.generateObjectID(),
      text: text.trim(),
      description: description.trim(),
      color: '#B0E0E6',
      x: 0,
      y: 0,
      selected: false,
      rank: 0,
      column: 0,
      created: now,
      lastModified: now,
      tags,
      blocks: [],
      blockedBy: [],
    };

    const updatedWaypoints = [...waypoints, newWaypoint];
    setWaypoints(updatedWaypoints);
    saveWaypoints(updatedWaypoints);
    
    // Sync to DynamoDB
    try {
      await SyncService.addAndSync(newWaypoint, 'waypoint', WAYPOINTS_STORAGE_KEY);
    } catch (error) {
      console.error('Error syncing new waypoint:', error);
      // Continue anyway - offline mode
    }
    
    return true;
  };

  const deleteWaypoint = (waypointId: string) => {
    Alert.alert(
      'Delete Waypoint',
      'Are you sure you want to delete this waypoint?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const waypointToDelete = waypoints.find(wp => wp.id === waypointId);
            const updatedWaypoints = waypoints.filter(wp => wp.id !== waypointId);
            setWaypoints(updatedWaypoints);
            saveWaypoints(updatedWaypoints);
            
            // Sync deletion to DynamoDB
            if (waypointToDelete?.northstarObjectID) {
              try {
                await SyncService.deleteAndSync(waypointToDelete.northstarObjectID, WAYPOINTS_STORAGE_KEY);
              } catch (error) {
                console.error('Error syncing waypoint deletion:', error);
                // Continue anyway - offline mode
              }
            }
          },
        },
      ]
    );
  };

  const filteredWaypoints = waypoints.filter(waypoint =>
    waypoint.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    waypoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    waypoint.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addBlockingRelationship = (blockingId: string, blockedId: string) => {
    const updatedWaypoints = waypoints.map(waypoint => {
      if (waypoint.id === blockingId) {
        return { 
          ...waypoint, 
          blocks: [...waypoint.blocks, blockedId],
          lastModified: new Date()
        };
      }
      if (waypoint.id === blockedId) {
        return { 
          ...waypoint, 
          blockedBy: [...waypoint.blockedBy, blockingId],
          lastModified: new Date()
        };
      }
      return waypoint;
    });
    setWaypoints(updatedWaypoints);
    saveWaypoints(updatedWaypoints);
  };

  const removeBlockingRelationship = (blockingId: string, blockedId: string) => {
    const updatedWaypoints = waypoints.map(waypoint => {
      if (waypoint.id === blockingId) {
        return { 
          ...waypoint, 
          blocks: waypoint.blocks.filter(id => id !== blockedId),
          lastModified: new Date()
        };
      }
      if (waypoint.id === blockedId) {
        return { 
          ...waypoint, 
          blockedBy: waypoint.blockedBy.filter(id => id !== blockingId),
          lastModified: new Date()
        };
      }
      return waypoint;
    });
    setWaypoints(updatedWaypoints);
    saveWaypoints(updatedWaypoints);
  };

  const clearAllWaypoints = async () => {
    try {
      await AsyncStorage.removeItem(WAYPOINTS_STORAGE_KEY);
      setWaypoints([]);
      console.log('Cleared all waypoints');
    } catch (error) {
      console.error('Error clearing waypoints:', error);
    }
  };

  return {
    waypoints,
    searchQuery,
    setSearchQuery,
    filteredWaypoints,
    addWaypoint,
    deleteWaypoint,
    addBlockingRelationship,
    removeBlockingRelationship,
    syncWaypoints,
    clearAllWaypoints, // For debugging
  };
};