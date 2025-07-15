import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { DataService, Waypoint } from '../services/data.service';

export const useWaypoints = () => {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWaypoints();
  }, []);


  const loadWaypoints = async () => {
    try {
      setLoading(true);
      const waypointsData = await DataService.getWaypoints();
      setWaypoints(waypointsData);
    } catch (error) {
      console.error('Error loading waypoints from DynamoDB:', error);
    } finally {
      setLoading(false);
    }
  };


  const addWaypoint = async (name: string, description: string, tagsString: string) => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter waypoint name');
      return false;
    }

    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    // For now, create a basic waypoint structure
    // TODO: Implement proper waypoint creation through DataService
    Alert.alert('Info', 'Waypoint creation is temporarily disabled during migration to DynamoDB');
    return false;
  };

  const deleteWaypoint = (waypointId: string) => {
    Alert.alert(
      'Delete Waypoint',
      'Waypoint deletion is temporarily disabled during migration to DynamoDB',
      [{ text: 'OK' }]
    );
  };

  const filteredWaypoints = waypoints.filter(waypoint => {
    const query = searchQuery.toLowerCase();
    const name = waypoint.name?.toLowerCase() || '';
    const description = waypoint.description?.toLowerCase() || '';
    const tags = waypoint.tags || [];
    
    return name.includes(query) ||
           description.includes(query) ||
           tags.some(tag => tag?.toLowerCase().includes(query));
  });

  const addBlockingRelationship = (blockingId: string, blockedId: string) => {
    Alert.alert('Info', 'Blocking relationships are temporarily disabled during migration to DynamoDB');
  };

  const removeBlockingRelationship = (blockingId: string, blockedId: string) => {
    Alert.alert('Info', 'Blocking relationships are temporarily disabled during migration to DynamoDB');
  };

  const clearAllWaypoints = async () => {
    try {
      DataService.clearCache();
      setWaypoints([]);
      console.log('Cleared waypoints cache');
    } catch (error) {
      console.error('Error clearing waypoints cache:', error);
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
    clearAllWaypoints,
    loading,
  };
};