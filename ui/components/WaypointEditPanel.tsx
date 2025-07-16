import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Waypoint } from '../lib/types';
import { SyncService } from '../services/sync.service';
import { waypointStyles } from '@/screens/WaypointsScreen.styles';
import { WaypointItem } from '@/screens/WaypointsForm';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeContainer: {
    flex: 1,
    width,
    height,
    overflow: 'hidden',
  },
  constellationContainer: {
    position: 'absolute',
    width,
    height,
  },
  graph: {
    flex: 1,
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.4,
    backgroundColor: '#3b3565ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 10,
  },
  panelText: {
    fontSize: 18,
    color: '#333',
  },
});

const WaypointEditPanel = ({
  waypoints,
  setWaypoints,
}: {
  waypoints: Waypoint[];
  setWaypoints: (waypoints: Waypoint[]) => void;
}) => {
  const [editingWaypoint, setEditingWaypoint] = useState<Waypoint | null>(null);
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [blocks, setBlocks] = useState('');
  const [blockedBy, setBlockedBy] = useState('');

  const saveChanges = async () => {
    if (editingWaypoint) {
      const updatedTags = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const updatedBlocks = blocks
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0);

      const updatedBlockedBy = blockedBy
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0);

      const updatedWaypoint = {
        ...editingWaypoint,
        text,
        description,
        tags: updatedTags,
        blocks: updatedBlocks,
        blockedBy: updatedBlockedBy,
        lastModified: new Date(),
      };

      setWaypoints(
        waypoints.map((waypoint) =>
          waypoint.id === editingWaypoint.id ? updatedWaypoint : waypoint,
        ),
      );

      // Sync to DynamoDB
      try {
        await SyncService.updateAndSync(
          updatedWaypoint,
          'waypoint',
          'waypoints',
        );
      } catch (error) {
        console.error('Error syncing waypoint update:', error);
        // Continue anyway - offline mode
      }

      setEditingWaypoint(null);
    }
  };

  const completeTask = () => {
    if (editingWaypoint) {
      setWaypoints(
        waypoints.map((waypoint) =>
          waypoint.id === editingWaypoint.id
            ? { ...waypoint, completed: true }
            : waypoint,
        ),
      );
      setEditingWaypoint(null);
    }
  };

  function deleteWaypoint(waypointId: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <View style={styles.panel}>
      <View style={{ flexDirection: 'row', width: '100%', height: '80%' }}>
        <View
          id="editPanel"
          style={{
            flex: 1,
            padding: 12,
            justifyContent: 'center',
          }}
        >
          <TextInput
            style={waypointStyles.textInput}
            placeholder="Waypoint Title"
            placeholderTextColor="#888"
            value={text}
            onChangeText={setText}
          />
          <TextInput
            style={waypointStyles.textInput}
            placeholder="Description (optional)"
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TextInput
            style={waypointStyles.textInput}
            placeholder="Blocks (optional)"
            placeholderTextColor="#888"
            value={blocks}
            onChangeText={setBlocks}
            multiline
          />
          <TextInput
            style={waypointStyles.textInput}
            placeholder="Blocked by (optional)"
            placeholderTextColor="#888"
            value={blockedBy}
            onChangeText={setBlockedBy}
            multiline
          />
          <TextInput
            style={waypointStyles.textInput}
            placeholder="Tags (comma-separated) Ex: quest1, urgent, work"
            placeholderTextColor="#888"
            value={tags}
            onChangeText={setTags}
          />
        </View>
        <View
          id="editList"
          style={{
            flex: 1,
            padding: 12,
          }}
        >
          <FlatList
            data={waypoints}
            renderItem={({ item }) => (
              <WaypointItem item={item} onDelete={deleteWaypoint} />
            )}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
        <Button color= "#225c6e" title="Edit" onPress={() => setEditingWaypoint(null)} />
        <Button color= "#225c6e" title="Complete" onPress={completeTask} />
        <Button color= "#225c6e" title="Save" onPress={saveChanges} />
      </View>
    </View>
  );
};

export default WaypointEditPanel;
