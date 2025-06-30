import {
  QuestConstellationScreenProps,
  Waypoint,
  Quest,
  Node,
  DrawerParamList,
  DependencyRanks,
} from '../lib/types';
import { SyncService } from '../services/sync.service';

export const quests: Quest[] = [
  {
    id: 'quest-1',
    northstarObjectID: 'quest-northstar-static-id',
    name: 'Northstar',
    created: new Date(),
    lastModified: new Date(),
    nodes: [
      { id: 'north-A', northstarObjectID: 'node-a-static-id', color: '#B0E0E6', x: 100, y: 100, description: '' },
      { id: 'north-B', northstarObjectID: 'node-b-static-id', color: '#B0E0E6', x: 200, y: 100, description: '' },
      { id: 'north-C', northstarObjectID: 'node-c-static-id', color: '#B0E0E6', x: 150, y: 200, description: '' },
      { id: 'north-D', northstarObjectID: 'node-d-static-id', color: '#B0E0E6', x: 300, y: 200, description: '' },
      { id: 'north-E', northstarObjectID: 'node-e-static-id', color: '#B0E0E6', x: 250, y: 300, description: '' },
    ],
    links: [
      { source: 'north-A', target: 'north-B' },
      { source: 'north-A', target: 'north-C' },
      { source: 'north-B', target: 'north-D' },
      { source: 'north-C', target: 'north-D' },
      { source: 'north-D', target: 'north-E' },
    ],
  },
  {
    id: 'quest-2',
    northstarObjectID: 'quest-samareite-static-id',
    name: 'Samareite',
    created: new Date(),
    lastModified: new Date(),
    nodes: [
      { id: 'sam-A', northstarObjectID: 'node-sam-a-static-id', color: '#B0E0E6', x: 100, y: 100, description: '' },
      { id: 'sam-B', northstarObjectID: 'node-sam-b-static-id', color: '#B0E0E6', x: 200, y: 100, description: '' },
      { id: 'sam-C', northstarObjectID: 'node-sam-c-static-id', color: '#B0E0E6', x: 150, y: 200, description: '' },
      { id: 'sam-D', northstarObjectID: 'node-sam-d-static-id', color: '#B0E0E6', x: 300, y: 200, description: '' },
      { id: 'sam-E', northstarObjectID: 'node-sam-e-static-id', color: '#B0E0E6', x: 250, y: 300, description: '' },
    ],
    links: [
      { source: 'sam-A', target: 'sam-E' },
      { source: 'sam-B', target: 'sam-E' },
      { source: 'sam-C', target: 'sam-E' },
      { source: 'sam-D', target: 'sam-E' },
    ],
  },
];