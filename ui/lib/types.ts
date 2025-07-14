import { DrawerScreenProps } from '@react-navigation/drawer';

export type DrawerParamList = Record<string, { questIdx: number }> & {
  Waypoints: undefined;
};
export type QuestConstellationScreenProps<T extends keyof DrawerParamList> =
  DrawerScreenProps<DrawerParamList, T>;

// The portable data
export type Node = {
  id: string;
  northstarObjectID: string;
  text?: string;
  description: string;
  color: string; // TODO remove
  x: number; // TODO remove
  y: number; // TODO remove
};

// The data for visualization
export type Waypoint = {
  id: string;
  northstarObjectID: string;
  text: string;
  description: string;
  color: string;
  x: number;
  y: number;
  selected: boolean;
  rank: number;
  column: number;
  created: Date;
  lastModified: Date;
  tags: string[];
  completed?: boolean;
  blocks: string[]; // Array of waypoint IDs that this waypoint blocks
  blockedBy: string[]; // Array of waypoint IDs that block this waypoint
};

export type Quest = {
  id: string;
  northstarObjectID: string;
  name: string;
  nodes: Node[];
  links: any[];
  created: Date;
  lastModified: Date;
};

export type DependencyRanks = { [key: string]: number };

// Object type enum for consistency
export type NorthstarObjectType = 'Quest' | 'Waypoint' | 'Tag' | 'TagType';

// Base type for all syncable objects
export interface SyncableObject {
  northstarObjectID: string;
  lastModified: Date;
  objectType: NorthstarObjectType;
}

// Data service interfaces for DynamoDB objects
export interface QuestData {
  id: string;
  name: string;
  type: NorthstarObjectType;
  lastModified: Date;
}

export interface WaypointData {
  id: string;
  questIds: string[];
  name: string;
  description: string;
  unblocks: string[];
  tags: string[];
  completed: boolean;
  lastModified: Date;
}

export interface TagTypeData {
  id: string;
  name: string;
  type: NorthstarObjectType;
  lastModified: Date;
}

export interface TagData {
  id: string;
  name: string;
  type: NorthstarObjectType;
  tagTypeId: string;
  lastModified: Date;
}

// DynamoDB item structure
export interface DynamoDBItem extends SyncableObject {
  data: any; // The actual object data (Waypoint, Quest, etc.)
}
