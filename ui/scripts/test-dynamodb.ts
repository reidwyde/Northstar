#!/usr/bin/env npx ts-node

import { DynamoDBService } from '../services/dynamodb.service';

async function testDynamoDBConnection() {
  console.log('🔍 Testing DynamoDB connection...\n');
  
  try {
    console.log('1. Testing getAllItems()...');
    const allItems = await DynamoDBService.getAllItems();
    console.log(`   ✅ Success: Found ${allItems.length} items`);
    
    console.log('\n2. Testing getAllItemsByType("quest")...');
    const quests = await DynamoDBService.getAllItemsByType('quest');
    console.log(`   ✅ Success: Found ${quests.length} quests`);
    
    console.log('\n3. Testing getAllItemsByType("waypoint")...');
    const waypoints = await DynamoDBService.getAllItemsByType('waypoint');
    console.log(`   ✅ Success: Found ${waypoints.length} waypoints`);
    
    console.log('\n🎉 All DynamoDB tests passed!');
    
  } catch (error: any) {
    console.error('\n❌ DynamoDB test failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.name === 'CRC32CheckFailed') {
      console.log('\n🔧 CRC32CheckFailed suggests:');
      console.log('   • Network connectivity issues');
      console.log('   • Regional endpoint problems');
      console.log('   • Potential data corruption during transmission');
      console.log('   • Try using different AWS region or endpoint configuration');
    }
    
    process.exit(1);
  }
}

// Run the test
testDynamoDBConnection();