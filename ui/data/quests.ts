import {
  QuestConstellationScreenProps,
  Star,
  Quest,
  Node,
  DrawerParamList,
  DependencyRanks,
} from '../lib/types';

export const quests: Quest[] = [
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
