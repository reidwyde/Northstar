import React, { useRef } from 'react';
import { Platform } from 'react-native';
import VisNetwork, { Data } from 'react-native-vis-network';
import Cytoscape from 'cytoscape';

type GraphJson = {
  nodes: any[], 
  edges: any[],
};

const TodoGraph = (
  {
    graphJson={nodes: [], edges: []}
  }:{
    graphJson: {
      nodes: {
        id: string;
        label: string;
        description?: string;
      }[];
      edges: {
        from: string;
        to: string;
      }[];
    }
  }
) => {

  const data: Data = {
    edges: [
      { from: 1, to: 3 },
      { from: 1, to: 2 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 3 },
    ],
    nodes: [
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
      { id: 4, label: 'Node 4' },
      { id: 5, label: 'Node 5' },
    ],
  };

  if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
    return (
      <Cytoscape
        style={{
          width: '100%',
          height: '500px',
        }}
        elements={data}
      />
    );
  }

  const visNetworkRef = useRef<VisNetworkRef>(null);

  return (
    <>
    <VisNetwork data={data} ref={visNetworkRef} />
    </>
  );
};

export default TodoGraph;
