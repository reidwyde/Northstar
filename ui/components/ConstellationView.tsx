import React from 'react';
import { Waypoint, Quest } from '../lib/types';
import { simpleRankAndCol } from '../lib/utils';
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
  
  // Calculate layout using the simpleRankAndCol algorithm
  const layout = simpleRankAndCol(waypoints);
  
  const waypointsWithPositions = waypoints.map((waypoint) => {
    const position = layout.positions[waypoint.id];
    if (!position) {
      console.warn(`No position found for waypoint ${waypoint.id}`);
      return {
        ...waypoint,
        x: 0,
        y: 0,
        color: waypoint.completed ? '#4CAF50' : '#2196F3',
      };
    }
    
    return {
      ...waypoint,
      x: position.x,
      y: position.y,
      color: waypoint.completed ? '#4CAF50' : '#2196F3', // Green if completed, blue otherwise
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
          setWaypoints(
            waypoints.map((waypointPrime) => ({
              ...waypointPrime,
              selected: waypoint.id === waypointPrime.id,
            })),
          );
        }}
      />
      <SvgText
        x={waypoint.x + 25}
        y={waypoint.y - 25} // adjust above the circle
        fontSize="12"
        fill="white"
        textAnchor="middle"
      >
        {`${waypoint.name}`}
      </SvgText>
      <SvgText
        x={waypoint.x}
        y={waypoint.y + 35} // adjust below the circle
        fontSize="10"
        fill="lightgray"
        textAnchor="middle"
      >
        {`(${layout.positions[waypoint.id]?.rank || 0}, ${layout.positions[waypoint.id]?.column || 0})`}
      </SvgText>
    </React.Fragment>
  ));

  // Render links based on calculated layout
  const renderLinks = layout.links.map((link, index) => (
    <Line
      key={`${link.sourceId}-${link.targetId}-${index}`}
      x1={link.x1}
      y1={link.y1}
      x2={link.x2}
      y2={link.y2}
      stroke="gray"
      strokeWidth={2}
    />
  ));

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
