import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveGraph = async (graph) => {
  try {
    await AsyncStorage.setItem('graphData', JSON.stringify(graph));
  } catch (error) {
    console.error('Error saving graph:', error);
  }
};

export const loadGraph = async () => {
  try {
    const data = await AsyncStorage.getItem('graphData');
    return data ? JSON.parse(data) : { nodes: [], links: [] };
  } catch (error) {
    console.error('Error loading graph:', error);
    return { nodes: [], links: [] };
  }
};

