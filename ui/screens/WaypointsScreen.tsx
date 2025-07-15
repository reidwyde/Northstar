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
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const WaypointsScreen: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    filteredWaypoints,
    addWaypoint,
    deleteWaypoint,
    clearAllWaypoints,
    loading,
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
        {loading ? 'Loading waypoints...' : 
         searchQuery ? 'No waypoints match your search' : 'No waypoints yet. Add one above!'}
      </Text>
    </View>
  );

  return (
    <View style={waypointStyles.container}>
      <View id='wayPointForm'>
      <Text style={waypointStyles.header}>Waypoints</Text>
      
      {/* Temporary debug button */}
      <TouchableOpacity 
        style={{ backgroundColor: 'red', padding: 10, margin: 10, borderRadius: 5 }}
        onPress={clearAllWaypoints}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Clear All (Debug)</Text>
      </TouchableOpacity>
     <View style={waypointStyles.searchContainer}>
        <View style={{ position: 'relative', justifyContent: 'center' }}>
          <TextInput
            style={{
              ...waypointStyles.searchInput,
              paddingRight: 36, // Space for icon
            }}
            placeholder="Search waypoints..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <MaterialIcons
            name="search"
            size={24}
            color="black"
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              marginTop: -12, // Half icon height for vertical centering
              zIndex: 1,
            }}
            pointerEvents="none"
          />
        </View>
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
      </View>

      <View id ='wayPointList'>
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
    </View>
  );
};

export default WaypointsScreen;