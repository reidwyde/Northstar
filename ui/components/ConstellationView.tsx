import React from 'react';
import { Waypoint, Quest } from '../lib/types';
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
  console.log('constelation view' , waypoints);
  const waypointsWithPositions = waypoints.map((waypoint) => {
    // Use rank for y-position and column for x-position
    // with some spacing between nodes
    const x = waypoint.column * 100 + 50;
    const y = waypoint.rank * 100 + 100;

    return {
      ...waypoint,
      x,
      y,
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
        {`${waypoint.id}`}
      </SvgText>
      <SvgText
        x={waypoint.x}
        y={waypoint.y + 35} // adjust below the circle
        fontSize="10"
        fill="lightgray"
        textAnchor="middle"
      >
        {`(${waypoint.rank}, ${waypoint.column})`}
      </SvgText>
    </React.Fragment>
  ));

  const renderLinks = quest.links.map((link, index) => {
    const sourceNode = waypointsWithPositions.find(
      (waypoint) => waypoint.id === link.source,
    );
    const targetNode = waypointsWithPositions.find(
      (waypoint) => waypoint.id === link.target,
    );

    if (!sourceNode || !targetNode) return null;

    return (
      <Line
        key={index}
        x1={sourceNode.x}
        y1={sourceNode.y}
        x2={targetNode.x}
        y2={targetNode.y}
        stroke="gray"
        strokeWidth={2}
      />
    );
  });

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
