import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Waypoint } from '../lib/types';
import { SyncService } from '../services/sync.service';

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
    backgroundColor: '#ffffff',
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

  console.log('EDITING',waypoints)
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

  return (
    <View style={styles.panel}>
        <>
          <TextInput
            placeholder="Enter waypoint text"
            value={text}
            onChangeText={(text) => setText(text)}
            style={[styles.panelText, { width: '100%' }]}
          />
          <TextInput
            placeholder="Enter description"
            value={description}
            onChangeText={(text) => setDescription(text)}
            style={[styles.panelText, { width: '100%' }]}
          />
          <TextInput
            placeholder="Enter tags (comma-separated)"
            value={tags}
            onChangeText={(text) => setTags(text)}
            style={[styles.panelText, { width: '100%' }]}
          />
          <TextInput
            placeholder="Blocks (comma-separated waypoint IDs)"
            value={blocks}
            onChangeText={(text) => setBlocks(text)}
            style={[styles.panelText, { width: '100%' }]}
          />
          <TextInput
            placeholder="Blocked by (comma-separated waypoint IDs)"
            value={blockedBy}
            onChangeText={(text) => setBlockedBy(text)}
            style={[styles.panelText, { width: '100%' }]}
          />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button title="Edit" onPress={() => setEditingWaypoint(null)} />
            <Button title="Complete" onPress={completeTask} />
            <Button title="Save" onPress={saveChanges} />
          </View>
        </>
    </View>
  );
};

export default WaypointEditPanel;
