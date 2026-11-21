import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

let database;
let client;

const connectToDb = async (options = {}) => {
  if (database) {
    return database;
  }

  const connectionString = options.connectionString || process.env.MONGODB_URI;
  const databaseName = options.databaseName || process.env.MONGODB_DB_NAME || 'practice';

  if (!connectionString) {
    throw new Error('MONGODB_URI is required.');
  }

  const nextClient = new MongoClient(connectionString);
  await nextClient.connect();

  try {
    await mongoose.connect(connectionString, { dbName: databaseName });
  } catch (error) {
    await nextClient.close();
    throw error;
  }

  client = nextClient;
  database = client.db(databaseName);
  return database;
};

const getDb = () => {
  if (!database) {
    throw new Error('Database not initialized. Call connectToDb first.');
  }
  return database;
};

const closeDb = async () => {
  if (client) {
    await client.close();
    client = undefined;
  }

  await mongoose.disconnect();
  database = undefined;
};

export { closeDb, connectToDb, getDb };
