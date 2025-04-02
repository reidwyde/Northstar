import React, { useEffect, useState } from 'react';
import {
  DrawerScreenProps,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import GestureRecognizer, {
  swipeDirections,
} from 'react-native-swipe-gestures';

const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;

// import { NavigationContainer } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as d3 from 'd3-force';

const { width, height } = Dimensions.get('window');

// Define the route names and their expected parameters
// type DrawerParamList = {
//   QuestConstellation: { questIdx: number };
// };

type DrawerParamList = Record<string, { questIdx: number }>;

// type QuestConstellationScreenProps = DrawerScreenProps<
//   DrawerParamList,
//   'QuestConstellation'
// >;
//

type QuestConstellationScreenProps<T extends keyof DrawerParamList> =
  DrawerScreenProps<DrawerParamList, T>;

type Quest = {
  name: string;
  nodes: any[];
  links: any[];
};

const quests: Quest[] = [
  {
    name: 'Northstar',
    nodes: [
      { id: 'A', color: '#B0E0E6', x: 100, y: 100, description: '' },
      { id: 'B', color: '#B0E0E6', x: 200, y: 100, description: '' },
      { id: 'C', color: '#B0E0E6', x: 150, y: 200, description: '' },
      { id: 'D', color: '#B0E0E6', x: 300, y: 200, description: '' },
      { id: 'E', color: '#B0E0E6', x: 250, y: 300, description: '' },
    ],
    links: [
      { source: 'A', target: 'B' },
      { source: 'A', target: 'C' },
      { source: 'B', target: 'D' },
      { source: 'C', target: 'D' },
      { source: 'D', target: 'E' },
    ],
  },

  {
    name: 'Samareite',
    nodes: [
      { id: 'A', color: '#B0E0E6', x: 100, y: 100, description: '' },
      { id: 'B', color: '#B0E0E6', x: 200, y: 100, description: '' },
      { id: 'C', color: '#B0E0E6', x: 150, y: 200, description: '' },
      { id: 'D', color: '#B0E0E6', x: 300, y: 200, description: '' },
      { id: 'E', color: '#B0E0E6', x: 250, y: 300, description: '' },
    ],
    links: [
      { source: 'A', target: 'E' },
      { source: 'B', target: 'E' },
      { source: 'C', target: 'E' },
      { source: 'D', target: 'E' },
    ],
  },
];

// const QuestConstellationScreen: React.FC<QuestConstellationScreenProps> = ({
//   route,
// }) => {

// const SwipeUpComponent = () => {
//   const [showComponent, setShowComponent] = useState(false);
//   const translateY = new Animated.Value(height); // Start offscreen
//
//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onMoveShouldSetPanResponder: () => true,
//     onPanResponderMove: (_, gestureState) => {
//       // Move the component with finger swipe
//       translateY.setValue(
//         gestureState.dy + (showComponent ? -height * 0.6 : height),
//       );
//     },
//     onPanResponderRelease: (_, gestureState) => {
//       if (gestureState.dy < -50) {
//         // Swipe up past a certain threshold, open the component
//         Animated.timing(translateY, {
//           toValue: height * 0.6,
//           duration: 300,
//           useNativeDriver: true,
//         }).start(() => setShowComponent(true));
//       } else if (gestureState.dy > 50) {
//         // Swipe down, close the component
//         Animated.timing(translateY, {
//           toValue: height,
//           duration: 300,
//           useNativeDriver: true,
//         }).start(() => setShowComponent(false));
//       } else {
//         // Return to initial position if swipe is too small
//         Animated.spring(translateY, {
//           toValue: showComponent ? height * 0.6 : height,
//           useNativeDriver: true,
//         }).start();
//       }
//     },
//   });
//
//   return (
//     <View style={styles.detailsContainer}>
//       <Text
//         style={styles.header}
//         onPress={() => setShowComponent(!showComponent)}
//       >
//         Tap to {showComponent ? 'Hide' : 'Show'} Component
//       </Text>
//
//       {showComponent && (
//         <Animated.View
//           {...panResponder.panHandlers}
//           style={[styles.panel, { transform: [{ translateY }] }]}
//         >
//           <Text style={styles.panelText}>This is your swipe-up panel!</Text>
//         </Animated.View>
//       )}
//     </View>
//   );
// };

const Details = ({ stars }) => {
  console.log(stars);
  return (
    <View style={styles.panel}>
      {stars
        .filter((star) => star.selected)
        .map((star) => (
          <Text
            key={star.id}
            style={styles.panelText}
          >{`ID: ${star.id} Description: ${star.description}`}</Text>
        ))}
    </View>
  );
};

const QuestConstellationScreen: React.FC<
  QuestConstellationScreenProps<string>
> = ({ route, navigation }) => {
  const { questIdx } = route.params || { questIdx: 0 };
  const [stars, setStars] = useState(
    quests[questIdx].nodes.map((node) => ({ ...node, selected: false })),
  );
  const [links, setLinks] = useState(quests[questIdx].links);
  const [showDetails, setShowDetails] = useState(false);
  const renderStars = stars.map((star, index) => (
    <Circle
      key={index}
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
  ));

  const addNode = () => {
    console.log('todo add node');
  };

  const renderLinks = links.map((link, index) => {
    const sourceNode = stars.find((star) => star.id === link.source);
    const targetNode = stars.find((star) => star.id === link.target);

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

  const onSwipe = (gestureName: string, _: any) => {
    let newQuestIdx = questIdx;
    switch (gestureName) {
      case SWIPE_UP:
        setShowDetails(true);
        break;
      case SWIPE_DOWN:
        setShowDetails(false);
        break;
      case SWIPE_LEFT:
        newQuestIdx = (questIdx - 1 + quests.length) % quests.length;
        navigation.navigate(quests[newQuestIdx].name, {
          questIdx: newQuestIdx,
        });
        break;
      case SWIPE_RIGHT:
        newQuestIdx = (questIdx + 1 + quests.length) % quests.length;
        navigation.navigate(quests[newQuestIdx].name, {
          questIdx: newQuestIdx,
        });
        break;
    }
  };

  return (
    <View style={styles.container}>
      <GestureRecognizer onSwipe={onSwipe}>
        <Svg width={width} height={height} style={styles.graph}>
          {renderLinks}
          {renderStars}
        </Svg>
        {showDetails && <Details stars={stars} />}
        <Button title="Add Node" onPress={addNode} />
      </GestureRecognizer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  graph: {
    flex: 1,
    marginBottom: 20,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.4, // Panel takes up 40% of the screen
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 10, // For shadow on Android
  },
  panelText: {
    fontSize: 18,
    color: '#333',
  },
});

const Drawer = createDrawerNavigator<DrawerParamList>();

// <Drawer.Navigator
//       screenOptions={{
//         swipeEnabled: true, // Enables swipe gestures
//       }}
//     >

export default function App() {
  return (
    <Drawer.Navigator>
      {quests.map((quest, questIdx) => (
        <Drawer.Screen
          name={quest.name}
          component={QuestConstellationScreen}
          initialParams={{ questIdx }}
          key={quest.name}
        />
      ))}
    </Drawer.Navigator>
  );
}

// TODO make sure to do manipulation of the nodes and links in-place
// or else the d3 simulation doesn't work (remember from cognovi)

// const [nodes, setNodes] = useState(initialNodes);
// const [links, setLinks] = useState(initialLinks);

// useEffect(() => {
//   // Create the force simulation
//   const simulation = d3
//     .forceSimulation(nodes)
//     .force('link', d3.forceLink(links).id(d => d.id).distance(150))
//     .force('charge', d3.forceManyBody().strength(-500))
//     .force('center', d3.forceCenter(width / 2, height / 2));
//
//   simulation.on('tick', () => {
//     setNodes([...nodes]);
//     setLinks([...links]);
//   });
//
//   return () => simulation.stop();
// }, [nodes, links]);
//
// const addNode = () => {
//   const newNode = { id: `Node${nodes.length + 1}`, color: 'green', x: Math.random() * width, y: Math.random() * height };
//   const newNodes = [...nodes, newNode];
//   setNodes(newNodes);
//
//   // Create a new link (for simplicity, linking the last node to the first)
//   const newLink = { source: newNode.id, target: nodes[0].id };
//   const newLinks = [...links, newLink];
//   setLinks(newLinks);
// };

// export default function HomeScreen({ navigation }) {
//   // const [graphTitle, setGraphTitle] = useState('');
//
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Enter Graph Title:</Text>
//       {/*
//       <TextInput
//         style={{ borderWidth: 1, padding: 8, marginVertical: 10, width: 200 }}
//         value={graphTitle}
//         onChangeText={setGraphTitle}
//       />
//       */}
//       <TextInput
//         style={{ borderWidth: 1, padding: 8, marginVertical: 10, width: 200 }}
//       />
//
//       <Button
//         title="Create Graph"
//         onPress={() =>
//           navigation.navigate('Graph', { title: 'todo graphTitle' })
//         }
//       />
//     </View>
//   );
// }

// const QuestConstellationOld = ({ route }) => {
//   const { title } = route.params;
//
//   // const [graphTitle, setGraphTitle] = useState(title);
//   // const [isEditing, setIsEditing] = useState(false);
//
//   // useEffect(() => {
//   //   AsyncStorage.setItem('graphTitle', graphTitle);
//   // }, [graphTitle]);
//
//   return (
//     <View style={{ flex: 1, backgroundColor: '#111', padding: 20 }}>
//       {/*
//       <TouchableOpacity onPress={() => setIsEditing(true)}>
//         {isEditing ? (
//           <TextInput
//             style={{ color: 'white', fontSize: 20, borderBottomWidth: 1, borderColor: 'white' }}
//             value={'todo graphTitle'}
//             onChangeText={() => Console.log('todo setGraphTitle')}
//             onBlur={() => Console.log('todo setIsEditing(false)')}
//           />
//         ) : (
//           <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>{graphTitle}</Text>
//         )}
//       </TouchableOpacity>
//       */}
//
//       <Text
//         style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}
//       >{`title from homescreen ${title}`}</Text>
//       <GraphView />
//     </View>
//   );
// };
//
// /*
// import React, { useState, useEffect } from 'react';
//
// import { View, Button, StyleSheet } from 'react-native';
// import { WebView } from 'react-native-webview';
// import AsyncStorage from '@react-native-async-storage/async-storage';
//
// export default function GraphView() {
//
//   const nodes = [
//   { id: 'A', color: 'green' },
//   { id: 'B', color: 'blue' },
//   { id: 'C', color: 'red' },
//   { id: 'D', color: 'yellow' },
//   { id: 'E', color: 'purple' },
// ];
//
//   const links = [
//     { source: 'A', target: 'B' },
//     { source: 'A', target: 'C' },
//     { source: 'B', target: 'D' },
//     { source: 'C', target: 'D' },
//     { source: 'D', target: 'E' },
//   ];
//
//
//   const webviewRef = null;
//
//   // const [nodes, setNodes] = useState([]);
//   // const [links, setLinks] = useState([]);
//   // const [webviewRef, setWebviewRef] = useState(null);
//
//   // // Load graph data from AsyncStorage on mount
//   // useEffect(() => {
//   //   AsyncStorage.getItem('graphData').then((data) => {
//   //     if (data) {
//   //       const parsed = JSON.parse(data);
//   //       setNodes(parsed.nodes);
//   //       setLinks(parsed.links);
//   //     }
//   //   });
//   // }, []);
//
//   // Add a new node and update AsyncStorage
//   const addNode = () => {
//     const newNode = { id: nodes.length + 1, color: 'green' };
//     const newNodes = [...nodes, newNode];
//     setNodes(newNodes);
//     AsyncStorage.setItem('graphData', JSON.stringify({ nodes: newNodes, links }));
//
//     // Trigger the WebView to update the graph
//     if (webviewRef) {
//       webviewRef.injectJavaScript(`
//         window.graphData = ${JSON.stringify({ nodes: newNodes, links })};
//         updateGraph();
//       `);
//     }
//   };
//
//   // HTML and JS for the WebView to render the force graph
//   const graphHtml = `
//     <!DOCTYPE html>
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Graph View</title>
//         <script src="https://cdn.jsdelivr.net/npm/force-graph"></script>
//         <style>
//           body { margin: 0; padding: 0; overflow: hidden; }
//           canvas { display: block; }
//         </style>
//       </head>
//       <body>
//         <script>
//           let fg;
//           function updateGraph() {
//             if (fg) {
//               fg.graphData(window.graphData);
//             } else {
//               fg = ForceGraph()(document.body)
//                 .nodeAutoColorBy('id')
//                 .linkDirectionalParticles(2)
//                 .linkDirectionalParticleWidth(4);
//               fg.graphData(window.graphData);
//             }
//           }
//
//           window.graphData = ${JSON.stringify({ nodes, links })};
//           updateGraph();
//         </script>
//       </body>
//     </html>
//   `;
//
//   // ref={(ref) => setWebviewRef(ref)}
//   //
//   return (
//     <View style={styles.container}>
//       <WebView
//         originWhitelist={['*']}
//         source={{ html: graphHtml }}
//         style={styles.webview}
//         javaScriptEnabled={true}
//         injectedJavaScript={`window.graphData = ${JSON.stringify({ nodes, links })}; updateGraph();`}
//       />
//       <Button title="Add Node" onPress={addNode} />
//     </View>
//   );
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#111',
//     justifyContent: 'center',
//   },
//   webview: {
//     flex: 1,
//   },
// });
// */
//
