import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useWaypoints } from './WaypointsScreen.hooks';
import { WaypointItem, WaypointForm } from './WaypointsForm';
import { waypointStyles } from './WaypointsScreen.styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ErrorMessage from '../components/ErrorMessage'; // Add this import

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
  const [error, setError] = useState<string | null>(null); // Add error state

  const handleAddWaypoint = async () => {
    const success = await addWaypoint(newWaypointText, newWaypointDescription, newWaypointTags);
    if (success) {
      setNewWaypointText('');
      setNewWaypointDescription('');
      setNewWaypointTags('');
    }else{
    setError('Failed to add waypoint. Please try again.'); // Set error message
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
      {/* <TouchableOpacity 
        style={{ backgroundColor: 'red', padding: 10, margin: 10, borderRadius: 5 }}
        onPress={clearAllWaypoints}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Clear All (Debug)</Text>
      </TouchableOpacity> */}

      <View
        style={waypointStyles.searchContainer}
        onTouchStart={() => error && setError(null)}
      >
        <View style={{ position: 'relative', justifyContent: 'center' }}>
          <TextInput
            style={{
              ...waypointStyles.searchInput,
              paddingRight: 36, 
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
              marginTop: -12, 
              zIndex: 1,
            }}
            pointerEvents="none"
          />
        </View>
      </View>
      <View
        onTouchStart={() => error && setError(null)}
      >
        <WaypointForm
          newWaypointText={newWaypointText}
          setNewWaypointText={text => {
            if (error) setError(null);
            setNewWaypointText(text);
          }}
          newWaypointDescription={newWaypointDescription}
          setNewWaypointDescription={desc => {
            if (error) setError(null);
            setNewWaypointDescription(desc);
          }}
          newWaypointTags={newWaypointTags}
          setNewWaypointTags={tags => {
            if (error) setError(null);
            setNewWaypointTags(tags);
          }}
          onAdd={handleAddWaypoint}
        />
      </View>
      </View>
      {error && <ErrorMessage message={error} onClose={() => setError(null)}/>}

      {filteredWaypoints.length > 0 ? (
        <FlatList
          data={filteredWaypoints}
          renderItem={({ item }) => (
            <WaypointItem item={item} onDelete={deleteWaypoint} />
          )}
          keyExtractor={(item) => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState />
      )}

    </View>
  );
};

export default WaypointsScreen;