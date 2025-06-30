import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useWaypoints } from './WaypointsScreen.hooks';
import { WaypointItem, WaypointForm } from './WaypointsScreen.components';
import { waypointStyles } from './WaypointsScreen.styles';

const WaypointsScreen: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    filteredWaypoints,
    addWaypoint,
    deleteWaypoint,
    clearAllWaypoints,
  } = useWaypoints();

  const [newWaypointText, setNewWaypointText] = useState('');
  const [newWaypointDescription, setNewWaypointDescription] = useState('');
  const [newWaypointTags, setNewWaypointTags] = useState('');

  const handleAddWaypoint = async () => {
    const success = await addWaypoint(newWaypointText, newWaypointDescription, newWaypointTags);
    if (success) {
      setNewWaypointText('');
      setNewWaypointDescription('');
      setNewWaypointTags('');
    }
  };

  const EmptyState = () => (
    <View style={waypointStyles.emptyState}>
      <Text style={waypointStyles.emptyText}>
        {searchQuery ? 'No waypoints match your search' : 'No waypoints yet. Add one above!'}
      </Text>
    </View>
  );

  return (
    <View style={waypointStyles.container}>
      <Text style={waypointStyles.header}>Waypoints</Text>
      
      {/* Temporary debug button */}
      <TouchableOpacity 
        style={{ backgroundColor: 'red', padding: 10, margin: 10, borderRadius: 5 }}
        onPress={clearAllWaypoints}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Clear All (Debug)</Text>
      </TouchableOpacity>
      
      <View style={waypointStyles.searchContainer}>
        <TextInput
          style={waypointStyles.searchInput}
          placeholder="Search waypoints..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <WaypointForm
        newWaypointText={newWaypointText}
        setNewWaypointText={setNewWaypointText}
        newWaypointDescription={newWaypointDescription}
        setNewWaypointDescription={setNewWaypointDescription}
        newWaypointTags={newWaypointTags}
        setNewWaypointTags={setNewWaypointTags}
        onAdd={handleAddWaypoint}
      />

      {filteredWaypoints.length > 0 ? (
        <FlatList
          data={filteredWaypoints}
          renderItem={({ item }) => (
            <WaypointItem item={item} onDelete={deleteWaypoint} />
          )}
          keyExtractor={(item) => item.id}
          style={{ flex: 1 }}
        />
      ) : (
        <EmptyState />
      )}
    </View>
  );
};

export default WaypointsScreen;