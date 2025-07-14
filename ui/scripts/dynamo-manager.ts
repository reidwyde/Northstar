#!/usr/bin/env npx ts-node

import { DataService } from '../services/data.service';
import { DynamoDBItem } from '../lib/types';

class DynamoManager {
  static async clearTable(): Promise<void> {
    console.log('🗑️  Clearing all data from DynamoDB table...\n');
    
    try {
      const items = await DataService.getAllItems();
      
      if (items.length === 0) {
        console.log('📭 Table is already empty');
        return;
      }

      console.log(`🔄 Deleting ${items.length} items...`);
      
      for (const item of items) {
        await DataService.deleteItem(item.northstarObjectID);
        console.log(`   ✅ Deleted ${item.northstarObjectID}`);
      }
      
      console.log('\n🎉 Table cleared successfully!');
      
    } catch (error) {
      console.error('❌ Error clearing table:', error);
    }
  }

  static async migrateLocalData(): Promise<void> {
    console.log('📦 Migrating local quest data to DynamoDB...\n');
    
    try {
      const { quests, waypoints, tagTypes, tags } = require('../data/seedData');
      const itemsToInsert: DynamoDBItem[] = [];

      // Convert quests to DynamoDB items
      for (const quest of quests) {
        itemsToInsert.push({
          northstarObjectID: quest.id,
          objectType: 'Quest',
          lastModified: quest.lastModified,
          data: {
            id: quest.id,
            name: quest.name,
            type: quest.type,
            lastModified: quest.lastModified.toISOString(),
          }
        });
      }

      // Convert tagTypes to DynamoDB items
      for (const tagType of tagTypes) {
        itemsToInsert.push({
          northstarObjectID: tagType.id,
          objectType: 'TagType',
          lastModified: tagType.lastModified,
          data: {
            id: tagType.id,
            name: tagType.name,
            type: tagType.type,
            lastModified: tagType.lastModified.toISOString(),
          }
        });
      }

      // Convert tags to DynamoDB items
      for (const tag of tags) {
        itemsToInsert.push({
          northstarObjectID: tag.id,
          objectType: 'Tag',
          lastModified: tag.lastModified,
          data: {
            id: tag.id,
            name: tag.name,
            type: tag.type,
            tagTypeId: tag.tagTypeId,
            lastModified: tag.lastModified.toISOString(),
          }
        });
      }

      // Convert waypoints to DynamoDB items
      for (const waypoint of waypoints) {
        itemsToInsert.push({
          northstarObjectID: waypoint.id,
          objectType: 'Waypoint',
          lastModified: waypoint.lastModified,
          data: {
            id: waypoint.id,
            questIds: waypoint.questIds,
            name: waypoint.name,
            description: waypoint.description,
            unblocks: waypoint.unblocks,
            tags: waypoint.tags,
            completed: waypoint.completed,
            type: 'Waypoint',
            lastModified: waypoint.lastModified.toISOString(),
          }
        });
      }

      console.log(`🔄 Inserting ${itemsToInsert.length} items...`);
      
      await DataService.batchPutItems(itemsToInsert);
      
      console.log('🎉 Local data migrated successfully!');
      console.log(`   📊 Total items inserted: ${itemsToInsert.length}`);
      console.log(`   📋 Quests: ${quests.length}`);
      console.log(`   📍 Waypoints: ${waypoints.length}`);
      console.log(`   🏷️  TagTypes: ${tagTypes.length}`);
      console.log(`   🔖 Tags: ${tags.length}`);
      
    } catch (error) {
      console.error('❌ Error migrating data:', error);
    }
  }

  static async deleteItem(northstarObjectID: string): Promise<void> {
    console.log(`🗑️  Deleting item ${northstarObjectID}...\n`);
    
    try {
      const item = await DataService.getItem(northstarObjectID);
      
      if (!item) {
        console.log(`📭 Item ${northstarObjectID} not found`);
        return;
      }

      await DataService.deleteItem(northstarObjectID);
      console.log(`✅ Item ${northstarObjectID} deleted successfully`);
      
    } catch (error) {
      console.error('❌ Error deleting item:', error);
    }
  }

  static async updateItem(northstarObjectID: string, newData: any): Promise<void> {
    console.log(`✏️  Updating item ${northstarObjectID}...\n`);
    
    try {
      const existingItem = await DataService.getItem(northstarObjectID);
      
      if (!existingItem) {
        console.log(`📭 Item ${northstarObjectID} not found`);
        return;
      }

      const updatedItem: DynamoDBItem = {
        ...existingItem,
        lastModified: new Date(),
        data: { ...existingItem.data, ...newData }
      };

      await DataService.putItem(updatedItem);
      console.log(`✅ Item ${northstarObjectID} updated successfully`);
      
    } catch (error) {
      console.error('❌ Error updating item:', error);
    }
  }

  static async createQuest(name: string, northstarObjectID?: string): Promise<void> {
    const questId = northstarObjectID || `quest-${Date.now()}`;
    
    console.log(`📝 Creating new quest: ${name}...\n`);
    
    try {
      const questItem: DynamoDBItem = {
        northstarObjectID: questId,
        objectType: 'Quest',
        lastModified: new Date(),
        data: {
          id: questId,
          name,
          created: new Date(),
          lastModified: new Date(),
          links: [],
        }
      };

      await DataService.putItem(questItem);
      console.log(`✅ Quest "${name}" created with ID: ${questId}`);
      
    } catch (error) {
      console.error('❌ Error creating quest:', error);
    }
  }
}

// CLI interface
const command = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];

switch (command) {
  case 'clear':
    DynamoManager.clearTable();
    break;
  case 'migrate':
    DynamoManager.migrateLocalData();
    break;
  case 'delete':
    if (!arg1) {
      console.log('❌ Please specify northstarObjectID to delete');
      process.exit(1);
    }
    DynamoManager.deleteItem(arg1);
    break;
  case 'update':
    if (!arg1 || !arg2) {
      console.log('❌ Please specify northstarObjectID and JSON data to update');
      console.log('Example: npm run dynamo:manage update quest-1 \'{"name":"New Name"}\'');
      process.exit(1);
    }
    try {
      const updateData = JSON.parse(arg2);
      DynamoManager.updateItem(arg1, updateData);
    } catch (error) {
      console.log('❌ Invalid JSON data provided');
      process.exit(1);
    }
    break;
  case 'create-quest':
    if (!arg1) {
      console.log('❌ Please specify quest name');
      process.exit(1);
    }
    DynamoManager.createQuest(arg1, arg2);
    break;
  default:
    console.log(`
🛠️  DynamoDB Manager Tool

Usage:
  npx ts-node scripts/dynamo-manager.ts <command> [args]

Commands:
  clear                                    - Clear all data from the table
  migrate                                  - Migrate local quest data to DynamoDB
  delete <northstarObjectID>               - Delete a specific item
  update <northstarObjectID> <jsonData>    - Update an item with new data
  create-quest <name> [northstarObjectID]  - Create a new quest

Examples:
  npx ts-node scripts/dynamo-manager.ts clear
  npx ts-node scripts/dynamo-manager.ts migrate
  npx ts-node scripts/dynamo-manager.ts delete quest-1
  npx ts-node scripts/dynamo-manager.ts update quest-1 '{"name":"Updated Quest Name"}'
  npx ts-node scripts/dynamo-manager.ts create-quest "My New Quest"
    `);
}