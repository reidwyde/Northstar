import { DrawerScreenProps } from '@react-navigation/drawer';

export type DrawerParamList = Record<string, { questIdx: number }>;
export type QuestConstellationScreenProps<T extends keyof DrawerParamList> =
  DrawerScreenProps<DrawerParamList, T>;

// The portable data
export type Node = {
  id: string;
  name?: string; // TODO make definite
  description: string;
  color: string; // TODO remove
  x: number; // TODO remove
  y: number; // TODO remove
};

// The data for visualization
export type Star = {
  id: string;
  name?: string; // TODO make definite
  description: string;
  color: string;
  x: number;
  y: number;
  selected: boolean;
  rank: number;
  column: number;
};

export type Quest = {
  name: string;
  nodes: Node[];
  links: any[];
};

export type DependencyRanks = { [key: string]: number };
