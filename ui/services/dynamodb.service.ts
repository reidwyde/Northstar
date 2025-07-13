import 'react-native-get-random-values'; // Required for crypto in React Native
import { Buffer } from 'buffer';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  DeleteCommand, 
  ScanCommand, 
  BatchWriteCommand 
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBItem, SyncableObject } from '../lib/types';
import { AWS_CONFIG, DYNAMODB_CONFIG } from '../config/aws.config';

// Make Buffer available globally for AWS SDK
if (typeof global !== 'undefined') {
  global.Buffer = Buffer;
}

// Create DynamoDB client
const client = new DynamoDBClient({
  region: AWS_CONFIG.region,
  credentials: {
    accessKeyId: AWS_CONFIG.AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_CONFIG.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = DYNAMODB_CONFIG.tableName;

export class DynamoDBService {
  
  static async putItem(item: DynamoDBItem): Promise<void> {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        northstarObjectID: item.northstarObjectID,
        objectType: item.objectType,
        lastModified: item.lastModified.toISOString(),
        data: item.data,
      },
    });

    try {
      await docClient.send(command);
      console.log(`Successfully put item ${item.northstarObjectID}`);
    } catch (error) {
      console.error('Error putting item to DynamoDB:', error);
      throw error;
    }
  }

  static async getItem(northstarObjectID: string): Promise<DynamoDBItem | null> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        northstarObjectID,
      },
    });

    try {
      const result = await docClient.send(command);
      if (result.Item) {
        return {
          ...result.Item,
          lastModified: new Date(result.Item.lastModified),
        } as DynamoDBItem;
      }
      return null;
    } catch (error) {
      console.error('Error getting item from DynamoDB:', error);
      throw error;
    }
  }

  static async getAllItemsByType(objectType: string): Promise<DynamoDBItem[]> {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'objectType = :objectType',
      ExpressionAttributeValues: {
        ':objectType': objectType,
      },
    });

    try {
      const result = await docClient.send(command);
      return (result.Items || []).map(item => ({
        ...item,
        lastModified: new Date(item.lastModified),
      })) as DynamoDBItem[];
    } catch (error) {
      console.error('Error scanning items from DynamoDB:', error);
      throw error;
    }
  }

  static async deleteItem(northstarObjectID: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        northstarObjectID,
      },
    });

    try {
      await docClient.send(command);
      console.log(`Successfully deleted item ${northstarObjectID}`);
    } catch (error) {
      console.error('Error deleting item from DynamoDB:', error);
      throw error;
    }
  }

  static async getAllItems(): Promise<DynamoDBItem[]> {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    try {
      const result = await docClient.send(command);
      return (result.Items || []).map(item => ({
        ...item,
        lastModified: new Date(item.lastModified),
      })) as DynamoDBItem[];
    } catch (error) {
      console.error('Error scanning all items from DynamoDB:', error);
      throw error;
    }
  }

  static async batchPutItems(items: DynamoDBItem[]): Promise<void> {
    const batchSize = 25; // DynamoDB batch limit
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const command = new BatchWriteCommand({
        RequestItems: {
          [TABLE_NAME]: batch.map(item => ({
            PutRequest: {
              Item: {
                northstarObjectID: item.northstarObjectID,
                objectType: item.objectType,
                lastModified: item.lastModified.toISOString(),
                data: item.data,
              },
            },
          })),
        },
      });

      try {
        await docClient.send(command);
        console.log(`Successfully batch put ${batch.length} items`);
      } catch (error) {
        console.error('Error batch putting items to DynamoDB:', error);
        throw error;
      }
    }
  }
}