import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ErrorMessage: React.FC<{ message: string; onClose?: () => void }> = ({ message, onClose }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{message}</Text>
    {onClose && (
      <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
        <MaterialIcons name="close" size={22} color="#d32f2f" />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#ffe5e5',
    borderRadius: 6,
    marginVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  text: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  closeIcon: {
    marginLeft: 8,
    padding: 4,
  },
});

export default ErrorMessage;