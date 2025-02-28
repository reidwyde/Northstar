import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NetworkGraph } from 'react-network-graph';

interface Node {
  id: string;
  label: string;
}

interface Edge {
  source: string;
  target: string;
}

const ConstellationGraph = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    // Sample data
    const nodesData: Node[] = [
      { id: 'node1', label: 'Node 1' },
      { id: 'node2', label: 'Node 2' },
      { id: 'node3', label: 'Node 3' },
    ];

    const edgesData: Edge[] = [
      { source: 'node1', target: 'node2' },
      { source: 'node2', target: 'node3' },
      { source: 'node3', target: 'node1' },
    ];

    setNodes(nodesData);
    setEdges(edgesData);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <NetworkGraph
        nodes={nodes}
        edges={edges}
        nodeSize={20}
        edgeWidth={2}
        nodeColor="#fff"
        edgeColor="#ccc"
        layout="circular"
      />
    </View>
  );
};

export default ConstellationGraph;
