import { DynamoDBService } from './dynamodb.service';
import { DynamoDBItem, NorthstarObjectType, Quest, Waypoint, TagTypeData, TagData } from '../lib/types';

export class DataService {
  private static questsCache: Quest[] | null = null;
  private static waypointsCache: Waypoint[] | null = null;
  private static tagTypesCache: TagTypeData[] | null = null;
  private static tagsCache: TagData[] | null = null;

  /**
   * Load all quests from DynamoDB
   */
  static async getQuests(): Promise<Quest[]> {
    if (this.questsCache) {
      return this.questsCache;
    }

    try {
      const items = await DynamoDBService.getAllItemsByType('Quest');
      this.questsCache = items.map(item => ({
        id: item.data.id,
        northstarObjectID: item.northstarObjectID,
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
      const items = await DynamoDBService.getAllItemsByType('Waypoint');
      this.waypointsCache = items.map(item => ({
        id: item.data.id,
        northstarObjectID: item.northstarObjectID,
        name: item.data.name,
        description: item.data.description || '',
        questIds: item.data.questIds || [],
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
  static async getTagTypes(): Promise<TagTypeData[]> {
    if (this.tagTypesCache) {
      return this.tagTypesCache;
    }

    try {
      const items = await DynamoDBService.getAllItemsByType('TagType');
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
  static async getTags(): Promise<TagData[]> {
    if (this.tagsCache) {
      return this.tagsCache;
    }

    try {
      const items = await DynamoDBService.getAllItemsByType('Tag');
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

  // DynamoDB operations (inherited from DynamoDBService)
  static async putItem(item: DynamoDBItem): Promise<void> {
    await DynamoDBService.putItem(item);
    // Clear relevant cache after update
    this.clearCacheForObjectType(item.objectType);
  }

  static async getItem(northstarObjectID: string): Promise<DynamoDBItem | null> {
    return await DynamoDBService.getItem(northstarObjectID);
  }

  static async deleteItem(northstarObjectID: string): Promise<void> {
    // Get the item first to know what cache to clear
    const item = await DynamoDBService.getItem(northstarObjectID);
    await DynamoDBService.deleteItem(northstarObjectID);
    
    if (item) {
      this.clearCacheForObjectType(item.objectType);
    }
  }

  static async getAllItems(): Promise<DynamoDBItem[]> {
    return await DynamoDBService.getAllItems();
  }

  static async batchPutItems(items: DynamoDBItem[]): Promise<void> {
    await DynamoDBService.batchPutItems(items);
    // Clear all caches after batch update
    this.clearCache();
  }

  static async getAllItemsByType(objectType: string): Promise<DynamoDBItem[]> {
    return await DynamoDBService.getAllItemsByType(objectType);
  }

  private static clearCacheForObjectType(objectType: NorthstarObjectType): void {
    switch (objectType) {
      case 'Quest':
        this.questsCache = null;
        break;
      case 'Waypoint':
        this.waypointsCache = null;
        break;
      case 'TagType':
        this.tagTypesCache = null;
        break;
      case 'Tag':
        this.tagsCache = null;
        break;
    }
  }
}