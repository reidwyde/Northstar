#!/usr/bin/env npx ts-node

import { DataService } from '../services/data.service';

async function testMigrationWithLastModified() {
  console.log('🧪 Testing DynamoDB Migration with lastModified verification...\n');
  
  try {
    // Step 1: Clear DynamoDB
    console.log('1️⃣ Clearing DynamoDB table...');
    const existingItems = await DataService.getAllItems();
    console.log(`   Found ${existingItems.length} existing items`);
    
    for (const item of existingItems) {
      await DataService.deleteItem(item.northstarObjectID);
    }
    console.log('   ✅ Table cleared\n');
    
    // Step 2: Run migration
    console.log('2️⃣ Running migration...');
    const { quests, waypoints, tagTypes, tags } = require('../data/seedData');
    
    // Verify local data has lastModified fields
    console.log('   📋 Checking local data structure:');
    console.log(`   • Quests: ${quests.length} items`);
    console.log(`   • Waypoints: ${waypoints.length} items`);
    console.log(`   • TagTypes: ${tagTypes.length} items`);
    console.log(`   • Tags: ${tags.length} items`);
    
    // Check sample data for lastModified
    if (quests.length > 0) {
      const sampleQuest = quests[0];
      console.log(`   • Sample quest lastModified: ${sampleQuest.lastModified} (type: ${typeof sampleQuest.lastModified})`);
    }
    
    if (waypoints.length > 0) {
      const sampleWaypoint = waypoints[0];
      console.log(`   • Sample waypoint lastModified: ${sampleWaypoint.lastModified} (type: ${typeof sampleWaypoint.lastModified})`);
    }
    
    // Import and run migration directly
    const { quests: questsData, waypoints: waypointsData, tagTypes: tagTypesData, tags: tagsData } = require('../data/seedData');
    const itemsToInsert: any[] = [];

    // Convert data to DynamoDB format (same logic as dynamo-manager.ts)
    for (const quest of questsData) {
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

    for (const tagType of tagTypesData) {
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

    for (const tag of tagsData) {
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

    for (const waypoint of waypointsData) {
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

    console.log(`   Inserting ${itemsToInsert.length} items...`);
    await DataService.batchPutItems(itemsToInsert as any);
    console.log('   ✅ Migration completed\n');
    
    // Step 3: Verify migration results
    console.log('3️⃣ Verifying migration results...');
    const migratedItems = await DataService.getAllItems();
    console.log(`   Found ${migratedItems.length} migrated items\n`);
    
    // Step 4: Check lastModified fields
    console.log('4️⃣ Verifying lastModified fields...');
    let successCount = 0;
    let errorCount = 0;
    
    for (const item of migratedItems) {
      const itemType = item.objectType;
      const itemId = item.northstarObjectID;
      
      // Check if lastModified exists and is valid
      if (!item.lastModified) {
        console.log(`   ❌ ${itemType} ${itemId}: Missing lastModified field`);
        errorCount++;
        continue;
      }
      
      // Check if it's a valid Date
      if (!(item.lastModified instanceof Date)) {
        console.log(`   ❌ ${itemType} ${itemId}: lastModified is not a Date object (${typeof item.lastModified})`);
        errorCount++;
        continue;
      }
      
      // Check if it's a reasonable date (not in the future, not too old)
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      
      if (item.lastModified > now) {
        console.log(`   ⚠️  ${itemType} ${itemId}: lastModified is in the future (${item.lastModified.toISOString()})`);
        errorCount++;
        continue;
      }
      
      if (item.lastModified < oneYearAgo) {
        console.log(`   ⚠️  ${itemType} ${itemId}: lastModified is very old (${item.lastModified.toISOString()})`);
      }
      
      console.log(`   ✅ ${itemType} ${itemId}: ${item.lastModified.toISOString()}`);
      successCount++;
    }
    
    console.log(`\n📊 Results:`);
    console.log(`   ✅ Valid lastModified fields: ${successCount}`);
    console.log(`   ❌ Invalid lastModified fields: ${errorCount}`);
    console.log(`   📈 Success rate: ${((successCount / migratedItems.length) * 100).toFixed(1)}%`);
    
    // Step 5: Test basic data retrieval 
    console.log('\n5️⃣ Testing basic data retrieval...');
    
    const questItems = await DataService.getAllItemsByType('Quest');
    const waypointItems = await DataService.getAllItemsByType('Waypoint');
    
    console.log(`   • Retrieved ${questItems.length} quest items`);
    console.log(`   • Retrieved ${waypointItems.length} waypoint items`);
    
    // Check if retrieved data has proper Date objects
    if (questItems.length > 0) {
      const quest = questItems[0];
      console.log(`   • Quest lastModified: ${quest.lastModified.toISOString()} (${quest.lastModified instanceof Date ? 'Date' : typeof quest.lastModified})`);
    }
    
    if (waypointItems.length > 0) {
      const waypoint = waypointItems[0];
      console.log(`   • Waypoint lastModified: ${waypoint.lastModified.toISOString()} (${waypoint.lastModified instanceof Date ? 'Date' : typeof waypoint.lastModified})`);
    }
    
    if (errorCount === 0) {
      console.log('\n🎉 All tests passed! Migration successful with proper lastModified fields.');
    } else {
      console.log(`\n⚠️  Migration completed with ${errorCount} lastModified field issues.`);
      process.exit(1);
    }
    
  } catch (error: any) {
    console.error('\n❌ Migration test failed:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run the test
testMigrationWithLastModified();