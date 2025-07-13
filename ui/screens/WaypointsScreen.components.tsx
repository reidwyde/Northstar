import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Waypoint } from '../services/data.service';
import { waypointStyles } from './WaypointsScreen.styles';

interface WaypointItemProps {
  item: Waypoint;
  onDelete: (waypointId: string) => void;
}

export const WaypointItem: React.FC<WaypointItemProps> = ({ item, onDelete }) => (
  <View style={waypointStyles.waypointItem}>
    <View style={waypointStyles.waypointInfo}>
      <Text style={waypointStyles.waypointText}>{item.name}</Text>
      {item.description ? (
        <Text style={waypointStyles.waypointDescription}>{item.description}</Text>
      ) : null}
      <Text style={waypointStyles.waypointDate}>
        Modified: {item.lastModified.toLocaleDateString()}
      </Text>
      {item.tags.length > 0 && (
        <Text style={waypointStyles.waypointDate}>
          Tags: {item.tags.join(', ')}
        </Text>
      )}
      {item.unblocks.length > 0 && (
        <Text style={waypointStyles.waypointDate}>
          Unblocks: {item.unblocks.join(', ')}
        </Text>
      )}
      {item.completed && (
        <Text style={waypointStyles.waypointDate}>
          Status: Completed
        </Text>
      )}
    </View>
    <TouchableOpacity
      style={waypointStyles.deleteButton}
      onPress={() => onDelete(item.id)}
    >
      <Text style={waypointStyles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  </View>
);

interface WaypointFormProps {
  newWaypointText: string;
  setNewWaypointText: (text: string) => void;
  newWaypointDescription: string;
  setNewWaypointDescription: (text: string) => void;
  newWaypointTags: string;
  setNewWaypointTags: (text: string) => void;
  onAdd: () => void;
}

export const WaypointForm: React.FC<WaypointFormProps> = ({
  newWaypointText,
  setNewWaypointText,
  newWaypointDescription,
  setNewWaypointDescription,
  newWaypointTags,
  setNewWaypointTags,
  onAdd,
}) => (
  <View style={waypointStyles.addContainer}>
    <TextInput
      style={waypointStyles.textInput}
      placeholder="Waypoint Title"
      placeholderTextColor="#888"
      value={newWaypointText}
      onChangeText={setNewWaypointText}
    />
    <TextInput
      style={waypointStyles.textInput}
      placeholder="Description (optional)"
      placeholderTextColor="#888"
      value={newWaypointDescription}
      onChangeText={setNewWaypointDescription}
      multiline
    />
    <TextInput
      style={waypointStyles.textInput}
      placeholder="Tags (comma-separated) Ex: quest1, urgent, work"
      placeholderTextColor="#888"
      value={newWaypointTags}
      onChangeText={setNewWaypointTags}
    />
    <TouchableOpacity style={waypointStyles.addButton} onPress={onAdd}>
      <Text style={waypointStyles.addButtonText}>Add Waypoint</Text>
    </TouchableOpacity>
  </View>
);