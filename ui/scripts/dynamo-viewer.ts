#!/usr/bin/env npx ts-node

import { DataService } from '../services/data.service';
import { DynamoDBItem } from '../lib/types';

class DynamoViewer {
  static async viewAllData(): Promise<void> {
    console.log('🔍 Fetching all data from DynamoDB...\n');
    
    try {
      const items = await DataService.getAllItems();
      
      if (items.length === 0) {
        console.log('📭 No items found in DynamoDB table');
        return;
      }

      console.log(`📊 Found ${items.length} items in total\n`);
      
      // Group by object type
      const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.objectType]) {
          acc[item.objectType] = [];
        }
        acc[item.objectType].push(item);
        return acc;
      }, {} as Record<string, DynamoDBItem[]>);

      // Display by type
      Object.entries(groupedItems).forEach(([type, typeItems]) => {
        console.log(`📋 ${type.toUpperCase()}S (${typeItems.length}):`);
        typeItems.forEach(item => {
          console.log(`  🔸 ${item.northstarObjectID}`);
          console.log(`     Object Type: ${item.objectType}`);
          console.log(`     Last Modified: ${item.lastModified.toISOString()}`);
          if (item.data.name) {
            console.log(`     Name: ${item.data.name}`);
          }
          console.log(`     Data: ${JSON.stringify(item.data, null, 6)}`);
          console.log('');
        });
      });
      
    } catch (error) {
      console.error('❌ Error fetching data:', error);
    }
  }

  static async viewByType(objectType: string): Promise<void> {
    console.log(`🔍 Fetching ${objectType}s from DynamoDB...\n`);
    
    try {
      const items = await DataService.getAllItemsByType(objectType);
      
      if (items.length === 0) {
        console.log(`📭 No ${objectType}s found`);
        return;
      }

      console.log(`📊 Found ${items.length} ${objectType}(s)\n`);
      
      items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.northstarObjectID}`);
        console.log(`   Last Modified: ${item.lastModified.toISOString()}`);
        console.log(`   Data:`, JSON.stringify(item.data, null, 2));
        console.log('');
      });
      
    } catch (error) {
      console.error('❌ Error fetching data:', error);
    }
  }

  static async viewItem(northstarObjectID: string): Promise<void> {
    console.log(`🔍 Fetching item ${northstarObjectID} from DynamoDB...\n`);
    
    try {
      const item = await DataService.getItem(northstarObjectID);
      
      if (!item) {
        console.log(`📭 Item ${northstarObjectID} not found`);
        return;
      }

      console.log('📄 Item Details:');
      console.log(`   ID: ${item.northstarObjectID}`);
      console.log(`   Type: ${item.objectType}`);
      console.log(`   Last Modified: ${item.lastModified.toISOString()}`);
      console.log(`   Data:`, JSON.stringify(item.data, null, 2));
      
    } catch (error) {
      console.error('❌ Error fetching item:', error);
    }
  }
}

// CLI interface
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'all':
    DynamoViewer.viewAllData();
    break;
  case 'type':
    if (!arg) {
      console.log('❌ Please specify object type: Quest, Waypoint, Tag, or TagType');
      process.exit(1);
    }
    DynamoViewer.viewByType(arg);
    break;
  case 'item':
    if (!arg) {
      console.log('❌ Please specify northstarObjectID');
      process.exit(1);
    }
    DynamoViewer.viewItem(arg);
    break;
  default:
    console.log(`
🔧 DynamoDB Viewer Tool

Usage:
  npx ts-node scripts/dynamo-viewer.ts <command> [args]

Commands:
  all                    - View all data in the table
  type <objectType>      - View all items of a specific type (Quest, Waypoint, Tag, TagType)
  item <northstarObjectID> - View a specific item by ID

Examples:
  npx ts-node scripts/dynamo-viewer.ts all
  npx ts-node scripts/dynamo-viewer.ts type Quest
  npx ts-node scripts/dynamo-viewer.ts item quest-1
    `);
}