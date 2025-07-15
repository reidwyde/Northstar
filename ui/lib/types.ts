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

// Unified Waypoint type - combines DynamoDB data with UI properties
export interface Waypoint {
  id: string;
  northstarObjectID: string;
  name: string;
  description: string;
  questIds: string[];
  unblocks: string[];
  tags: string[];
  completed: boolean;
  lastModified: Date;
  // UI-specific properties (computed dynamically)
  selected?: boolean;
  // Visual properties (set by UI components)
  x?: number;
  y?: number;
  color?: string;
}

// Unified Quest type - combines DynamoDB data with UI properties
export interface Quest {
  id: string;
  northstarObjectID: string;
  name: string;
  type: NorthstarObjectType;
  lastModified: Date;
  // UI-specific properties for teammate's link rendering (deprecated - use waypoint.unblocks)
  nodes?: Node[];
  links?: any[];
  created?: Date;
}

export type DependencyRanks = { [key: string]: number };

// Layout algorithm output types
export interface WaypointPosition {
  waypointId: string;
  x: number;
  y: number;
  rank: number;
  column: number;
}

export interface WaypointLink {
  sourceId: string;
  targetId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface ConstellationLayout {
  positions: { [waypointId: string]: WaypointPosition };
  links: WaypointLink[];
}

// Object type enum for consistency
export type NorthstarObjectType = 'Quest' | 'Waypoint' | 'Tag' | 'TagType';

// Base type for all syncable objects
export interface SyncableObject {
  northstarObjectID: string;
  lastModified: Date;
  objectType: NorthstarObjectType;
}

// Tag interfaces for DynamoDB objects
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
