import { DynamoDBService } from './dynamodb.service';
import { DynamoDBItem } from '../lib/types';

// Define the type for object types
export type NorthstarObjectType = 'Quest' | 'Waypoint' | 'Tag' | 'TagType';

// Define the interfaces for our data types
export interface Quest {
  id: string;
  name: string;
  type: NorthstarObjectType;
  lastModified: Date;
}

export interface Waypoint {
  id: string;
  questIds: string[];
  name: string;
  description: string;
  unblocks: string[];
  tags: string[];
  completed: boolean;
  lastModified: Date;
}

export interface TagType {
  id: string;
  name: string;
  type: NorthstarObjectType;
  lastModified: Date;
}

export interface Tag {
  id: string;
  name: string;
  type: NorthstarObjectType;
  tagTypeId: string;
  lastModified: Date;
}

export class DataService {
  private static questsCache: Quest[] | null = null;
  private static waypointsCache: Waypoint[] | null = null;
  private static tagTypesCache: TagType[] | null = null;
  private static tagsCache: Tag[] | null = null;

  /**
   * Load all quests from DynamoDB
   */
  static async getQuests(): Promise<Quest[]> {
    if (this.questsCache) {
      return this.questsCache;
    }

    try {
      const items = await DynamoDBService.getAllItemsByType('quest');
      this.questsCache = items.map(item => ({
        id: item.data.id,
        name: item.data.name,
        type: item.data.type as NorthstarObjectType,
        lastModified: new Date(item.lastModified),
      }));
      return this.questsCache;
    } catch (error) {
      console.error('Error loading quests from DynamoDB:', error);
      return [];
    }
  }

  /**
   * Load all waypoints from DynamoDB
   */
  static async getWaypoints(): Promise<Waypoint[]> {
    if (this.waypointsCache) {
      return this.waypointsCache;
    }

    try {
      const items = await DynamoDBService.getAllItemsByType('waypoint');
      this.waypointsCache = items.map(item => ({
        id: item.data.id,
        questIds: item.data.questIds || [],
        name: item.data.name,
        description: item.data.description || '',
        unblocks: item.data.unblocks || [],
        tags: item.data.tags || [],
        completed: item.data.completed || false,
        lastModified: new Date(item.lastModified),
      }));
      return this.waypointsCache;
    } catch (error) {
      console.error('Error loading waypoints from DynamoDB:', error);
      return [];
    }
  }

  /**
   * Load all tag types from DynamoDB
   */
  static async getTagTypes(): Promise<TagType[]> {
    if (this.tagTypesCache) {
      return this.tagTypesCache;
    }

    try {
      const items = await DynamoDBService.getAllItemsByType('tagtype');
      this.tagTypesCache = items.map(item => ({
        id: item.data.id,
        name: item.data.name,
        type: item.data.type as NorthstarObjectType,
        lastModified: new Date(item.lastModified),
      }));
      return this.tagTypesCache;
    } catch (error) {
      console.error('Error loading tag types from DynamoDB:', error);
      return [];
    }
  }

  /**
   * Load all tags from DynamoDB
   */
  static async getTags(): Promise<Tag[]> {
    if (this.tagsCache) {
      return this.tagsCache;
    }

    try {
      const items = await DynamoDBService.getAllItemsByType('tag');
      this.tagsCache = items.map(item => ({
        id: item.data.id,
        name: item.data.name,
        type: item.data.type as NorthstarObjectType,
        tagTypeId: item.data.tagTypeId,
        lastModified: new Date(item.lastModified),
      }));
      return this.tagsCache;
    } catch (error) {
      console.error('Error loading tags from DynamoDB:', error);
      return [];
    }
  }

  /**
   * Get waypoints for a specific quest
   */
  static async getWaypointsByQuestId(questId: string): Promise<Waypoint[]> {
    const waypoints = await this.getWaypoints();
    return waypoints.filter(waypoint => waypoint.questIds.includes(questId));
  }

  /**
   * Get a specific quest by ID
   */
  static async getQuestById(questId: string): Promise<Quest | null> {
    const quests = await this.getQuests();
    return quests.find(quest => quest.id === questId) || null;
  }

  /**
   * Clear all caches (useful for refreshing data)
   */
  static clearCache(): void {
    this.questsCache = null;
    this.waypointsCache = null;
    this.tagTypesCache = null;
    this.tagsCache = null;
  }

  /**
   * Load all data (useful for pre-loading)
   */
  static async preloadAllData(): Promise<void> {
    await Promise.all([
      this.getQuests(),
      this.getWaypoints(),
      this.getTagTypes(),
      this.getTags(),
    ]);
  }
}