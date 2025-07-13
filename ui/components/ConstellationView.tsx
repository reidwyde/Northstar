import React from 'react';
import { Waypoint, Quest } from '../services/data.service';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { StyleSheet, Dimensions, View } from 'react-native';

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

const ConstellationView = ({
  quest,
  waypoints,
  setWaypoints,
}: {
  quest: Quest;
  waypoints: Waypoint[];
  setWaypoints: (waypoints: Waypoint[]) => void;
}) => {
  console.log('constellation view', waypoints);
  const waypointsWithPositions = waypoints.map((waypoint, index) => {
    // Calculate positions based on index and quest layout
    // Simple grid layout for now
    const gridWidth = Math.ceil(Math.sqrt(waypoints.length));
    const x = (index % gridWidth) * 120 + 60;
    const y = Math.floor(index / gridWidth) * 120 + 100;

    return {
      ...waypoint,
      x,
      y,
      color: waypoint.completed ? '#4CAF50' : '#2196F3', // Green if completed, blue otherwise
      selected: false, // Default to not selected
    };
  });

  const renderWaypoints = waypointsWithPositions.map((waypoint, index) => (
    <React.Fragment key={index}>
      <Circle
        cx={waypoint.x}
        cy={waypoint.y}
        r={20}
        fill={waypoint.color}
        stroke={waypoint.selected ? 'white' : 'none'}
        strokeWidth={waypoint.selected ? 3 : 0}
        onPress={() => {
          console.log('Waypoint selected:', waypoint.name);
          // Note: Selection functionality temporarily disabled during migration
        }}
      />
      <SvgText
        x={waypoint.x}
        y={waypoint.y - 25} // adjust above the circle
        fontSize="12"
        fill="white"
        textAnchor="middle"
      >
        {waypoint.name}
      </SvgText>
      <SvgText
        x={waypoint.x}
        y={waypoint.y + 35} // adjust below the circle
        fontSize="10"
        fill="lightgray"
        textAnchor="middle"
      >
        {waypoint.completed ? 'Completed' : 'In Progress'}
      </SvgText>
    </React.Fragment>
  ));

  // Render links based on waypoint unblocks relationships
  const renderLinks = waypointsWithPositions.flatMap((waypoint, waypointIndex) => 
    waypoint.unblocks.map((unblockedId, linkIndex) => {
      const targetNode = waypointsWithPositions.find(
        (wp) => wp.id === unblockedId,
      );

      if (!targetNode) return null;

      return (
        <Line
          key={`${waypointIndex}-${linkIndex}`}
          x1={waypoint.x}
          y1={waypoint.y}
          x2={targetNode.x}
          y2={targetNode.y}
          stroke="gray"
          strokeWidth={2}
        />
      );
    }).filter(Boolean)
  );

  return (
   <View style={styles.container}>
    <Svg
      width={'100%'}
      height={'100%'}
      style={{
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      {renderLinks}
      {renderWaypoints}
    </Svg>
  </View>
  );
};

export default ConstellationView;
