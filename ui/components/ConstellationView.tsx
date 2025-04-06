import React from 'react';
import { Star, Quest } from '../lib/types';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { StyleSheet, Dimensions } from 'react-native';

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
  stars,
  setStars,
}: {
  quest: Quest;
  stars: Star[];
  setStars: (stars: Star[]) => void;
}) => {
  console.log(stars);
  const starsWithPositions = stars.map((star) => {
    // Use rank for y-position and column for x-position
    // with some spacing between nodes
    const x = star.column * 100 + 50;
    const y = star.rank * 100 + 100;

    return {
      ...star,
      x,
      y,
    };
  });

  const renderStars = starsWithPositions.map((star, index) => (
    <React.Fragment key={index}>
      <Circle
        cx={star.x}
        cy={star.y}
        r={20}
        fill={star.color}
        stroke={star.selected ? 'white' : 'none'}
        strokeWidth={star.selected ? 3 : 0}
        onPress={() => {
          setStars(
            stars.map((starPrime) => ({
              ...starPrime,
              selected: star.id === starPrime.id,
            })),
          );
        }}
      />
      <SvgText
        x={star.x + 25}
        y={star.y - 25} // adjust above the circle
        fontSize="12"
        fill="white"
        textAnchor="middle"
      >
        {`${star.id}`}
      </SvgText>
      <SvgText
        x={star.x}
        y={star.y + 35} // adjust below the circle
        fontSize="10"
        fill="lightgray"
        textAnchor="middle"
      >
        {`(${star.rank}, ${star.column})`}
      </SvgText>
    </React.Fragment>
  ));

  const renderLinks = quest.links.map((link, index) => {
    const sourceNode = starsWithPositions.find(
      (star) => star.id === link.source,
    );
    const targetNode = starsWithPositions.find(
      (star) => star.id === link.target,
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
    <Svg width={width} height={height} style={styles.graph}>
      {renderLinks}
      {renderStars}
    </Svg>
  );
};

export default ConstellationView;
