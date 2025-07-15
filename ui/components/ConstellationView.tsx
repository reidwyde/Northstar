import React from 'react';
import { Waypoint, Quest } from '../lib/types';
import { calculateConstellationLayout } from '../lib/layoutUtils';
import Svg, { Circle, Line, Text as SvgText, Defs, Marker, Polygon } from 'react-native-svg';
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


// Helper function to wrap text at word boundaries if longer than maxLength
const wrapText = (text: string, maxLength: number = 10): string[] => {
  if (text.length <= maxLength) {
    return [text];
  }
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxLength) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Single word longer than maxLength, just add it
        lines.push(word);
      }
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
};

const ConstellationView = ({
  quest,
  waypoints,
  setWaypoints,
}: {
  quest: Quest;
  waypoints: Waypoint[];
  setWaypoints: (waypoints: Waypoint[]) => void;
}) => {

  // Calculate layout using screen-aware algorithm
  // Leave space at bottom for the control panel (about 1/4 of screen)
  // Also add top padding to prevent overhang
  const bottomPanelHeight = height / 4;
  const topPadding = 60;
  const availableHeight = height - bottomPanelHeight - topPadding;

  const layout = calculateConstellationLayout(waypoints, {
    screenWidth: width,
    screenHeight: availableHeight,
    padding: 80,
  });

  // Shift all positions down by the top padding
  Object.values(layout.positions).forEach(position => {
    position.y += topPadding;
  });

  // Adjust link positions too
  layout.links.forEach(link => {
    link.y1 += topPadding;
    link.y2 += topPadding;
  });

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
      {wrapText(waypoint.name).map((line, lineIndex) => (
        <SvgText
          key={`${waypoint.id}-line-${lineIndex}`}
          x={waypoint.x + 25}
          y={waypoint.y - 25 + (lineIndex * 14)} // stack lines below each other
          fontSize="12"
          fill="white"
          textAnchor="middle"
        >
          {line}
        </SvgText>
      ))}
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

  // Render links based on calculated layout with arrows
  const renderLinks = layout.links.map((link, index) => (
    <Line
      key={`${link.sourceId}-${link.targetId}-${index}`}
      x1={link.x1}
      y1={link.y1}
      x2={link.x2}
      y2={link.y2}
      stroke="gray"
      strokeWidth={2}
      markerEnd="url(#arrowhead)"
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
        <Defs>
          <Marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <Polygon
              points="0 0, 10 3.5, 0 7"
              fill="gray"
            />
          </Marker>
        </Defs>
        {renderLinks}
        {renderWaypoints}
      </Svg>
    </View>
  );
};

export default ConstellationView;
