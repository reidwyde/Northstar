import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values'; // Required for uuid in React Native

import { DynamoDBService } from './dynamodb.service';
import { DynamoDBItem, Waypoint, Quest, SyncableObject } from '../lib/types';

export type SyncableObjectType = 'waypoint' | 'quest' | 'node' | 'tag';

export interface SyncResult {
  synced: number;
  conflicts: number;
  errors: number;
}

export class SyncService {
  
  // Generate a new northstarObjectID
  static generateObjectID(): string {
    return uuidv4();
  }

  // Last write wins conflict resolution
  static resolveConflict(local: SyncableObject, remote: SyncableObject): SyncableObject {
    return local.lastModified > remote.lastModified ? local : remote;
  }

  // Sync a single object type (waypoints, quests, etc.)
  static async syncObjectType<T extends SyncableObject>(
    objectType: SyncableObjectType,
    localStorageKey: string,
    mapToSyncable: (item: any) => T,
    mapFromSyncable: (item: T) => any
  ): Promise<SyncResult> {
    const result: SyncResult = { synced: 0, conflicts: 0, errors: 0 };

    try {
      // Get local data
      const localDataStr = await AsyncStorage.getItem(localStorageKey);
      const localItems: T[] = localDataStr ? 
        JSON.parse(localDataStr).map((item: any) => ({
          ...mapToSyncable(item),
          lastModified: new Date(item.lastModified),
          created: item.created ? new Date(item.created) : new Date(),
        })) : [];

      // Get remote data
      const remoteItems = await DynamoDBService.getAllItemsByType(objectType);
      
      // Create maps for easier lookup
      const localMap = new Map<string, T>();
      const remoteMap = new Map<string, DynamoDBItem>();
      
      localItems.forEach(item => localMap.set(item.northstarObjectID, item));
      remoteItems.forEach(item => remoteMap.set(item.northstarObjectID, item));

      // Items to update in local storage
      const finalLocalItems: T[] = [];
      // Items to push to remote
      const itemsToPushRemote: DynamoDBItem[] = [];

      // Process all unique IDs from both local and remote
      const allIds = new Set([...localMap.keys(), ...remoteMap.keys()]);

      for (const id of allIds) {
        const localItem = localMap.get(id);
        const remoteItem = remoteMap.get(id);

        if (localItem && remoteItem) {
          // Both exist - resolve conflict
          const localSyncable: SyncableObject = {
            northstarObjectID: localItem.northstarObjectID,
            lastModified: localItem.lastModified,
            objectType,
          };
          
          const remoteSyncable: SyncableObject = {
            northstarObjectID: remoteItem.northstarObjectID,
            lastModified: remoteItem.lastModified,
            objectType: remoteItem.objectType,
          };

          const winner = this.resolveConflict(localSyncable, remoteSyncable);
          
          if (winner === localSyncable) {
            // Local wins - use local and push to remote
            finalLocalItems.push(localItem);
            itemsToPushRemote.push({
              northstarObjectID: id,
              objectType,
              lastModified: localItem.lastModified,
              data: mapFromSyncable(localItem),
            });
          } else {
            // Remote wins - use remote
            const mappedRemoteItem = mapToSyncable(remoteItem.data);
            finalLocalItems.push({
              ...mappedRemoteItem,
              lastModified: remoteItem.lastModified,
            } as T);
          }
          result.conflicts++;
        } else if (localItem) {
          // Only local exists - push to remote
          finalLocalItems.push(localItem);
          itemsToPushRemote.push({
            northstarObjectID: id,
            objectType,
            lastModified: localItem.lastModified,
            data: mapFromSyncable(localItem),
          });
        } else if (remoteItem) {
          // Only remote exists - add to local
          const mappedRemoteItem = mapToSyncable(remoteItem.data);
          finalLocalItems.push({
            ...mappedRemoteItem,
            lastModified: remoteItem.lastModified,
          } as T);
        }
        result.synced++;
      }

      // Update local storage
      await AsyncStorage.setItem(localStorageKey, JSON.stringify(finalLocalItems));

      // Push updates to remote
      if (itemsToPushRemote.length > 0) {
        await DynamoDBService.batchPutItems(itemsToPushRemote);
      }

    } catch (error) {
      console.error(`Error syncing ${objectType}:`, error);
      result.errors++;
    }

    return result;
  }

  // Sync all data types
  static async syncAll(): Promise<{ [key: string]: SyncResult }> {
    const results: { [key: string]: SyncResult } = {};

    try {
      // Sync waypoints
      results.waypoints = await this.syncObjectType<Waypoint>(
        'waypoint',
        'waypoints',
        (item: any) => ({
          ...item,
          northstarObjectID: item.northstarObjectID || this.generateObjectID(),
        } as Waypoint),
        (item: Waypoint) => item
      );

      // Add more object types here as needed
      // results.quests = await this.syncObjectType<Quest>(...);

    } catch (error) {
      console.error('Error during full sync:', error);
    }

    return results;
  }

  // Add a new object and immediately sync it
  static async addAndSync<T extends SyncableObject>(
    item: T,
    objectType: SyncableObjectType,
    localStorageKey: string
  ): Promise<void> {
    try {
      // Ensure object has required sync properties
      if (!item.northstarObjectID) {
        (item as any).northstarObjectID = this.generateObjectID();
      }
      item.lastModified = new Date();

      // Add to local storage
      const existingDataStr = await AsyncStorage.getItem(localStorageKey);
      const existingItems = existingDataStr ? JSON.parse(existingDataStr) : [];
      existingItems.push(item);
      await AsyncStorage.setItem(localStorageKey, JSON.stringify(existingItems));

      // Push to remote
      await DynamoDBService.putItem({
        northstarObjectID: item.northstarObjectID,
        objectType,
        lastModified: item.lastModified,
        data: item,
      });

    } catch (error) {
      console.error('Error adding and syncing item:', error);
      throw error;
    }
  }

  // Update an object and sync it
  static async updateAndSync<T extends SyncableObject>(
    updatedItem: T,
    objectType: SyncableObjectType,
    localStorageKey: string
  ): Promise<void> {
    try {
      updatedItem.lastModified = new Date();

      // Update in local storage
      const existingDataStr = await AsyncStorage.getItem(localStorageKey);
      const existingItems = existingDataStr ? JSON.parse(existingDataStr) : [];
      const itemIndex = existingItems.findIndex((item: any) => 
        item.northstarObjectID === updatedItem.northstarObjectID
      );
      
      if (itemIndex >= 0) {
        existingItems[itemIndex] = updatedItem;
        await AsyncStorage.setItem(localStorageKey, JSON.stringify(existingItems));
      }

      // Push to remote
      await DynamoDBService.putItem({
        northstarObjectID: updatedItem.northstarObjectID,
        objectType,
        lastModified: updatedItem.lastModified,
        data: updatedItem,
      });

    } catch (error) {
      console.error('Error updating and syncing item:', error);
      throw error;
    }
  }

  // Delete an object and sync the deletion
  static async deleteAndSync(
    northstarObjectID: string,
    localStorageKey: string
  ): Promise<void> {
    try {
      // Remove from local storage
      const existingDataStr = await AsyncStorage.getItem(localStorageKey);
      const existingItems = existingDataStr ? JSON.parse(existingDataStr) : [];
      const filteredItems = existingItems.filter((item: any) => 
        item.northstarObjectID !== northstarObjectID
      );
      await AsyncStorage.setItem(localStorageKey, JSON.stringify(filteredItems));

      // Delete from remote
      await DynamoDBService.deleteItem(northstarObjectID);

    } catch (error) {
      console.error('Error deleting and syncing item:', error);
      throw error;
    }
  }
}