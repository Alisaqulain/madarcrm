/**
 * MongoDB database connection utility using Mongoose
 */

import mongoose from 'mongoose';

let isConnected = false;

/**
 * Get MongoDB connection
 * Uses connection pooling and reuses existing connection if available
 */
export async function getDbConnection() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/madrasa_crm';
  
  try {
    // Connect to MongoDB with timeout settings
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
      socketTimeoutMS: 45000,
      connectTimeoutMS: 5000, // Connection timeout
    });
    
    isConnected = true;
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
}

/**
 * Check if database connection is healthy
 * @returns Object with connected status and optional error message
 */
export async function checkDbConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      // Ping the database to ensure it's responsive
      try {
        if (mongoose.connection.db) {
          await mongoose.connection.db.admin().ping();
          return { connected: true };
        } else {
          return { connected: false, error: 'Database connection not initialized' };
        }
      } catch (pingError: any) {
        return {
          connected: false,
          error: `Connection ping failed: ${pingError?.message || 'Unknown error'}`,
        };
      }
    }

    // Try to get connection (will connect if not already connected)
    const connection = await getDbConnection();
    
    // Check connection state
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (connection.readyState === 1) {
      // Ping the database to ensure it's responsive
      if (connection.db) {
        await connection.db.admin().ping();
        return { connected: true };
      } else {
        return { connected: false, error: 'Database connection not initialized' };
      }
    } else {
      return {
        connected: false,
        error: `Connection state: ${connection.readyState} (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)`,
      };
    }
  } catch (error: any) {
    // Handle specific MongoDB connection errors
    let errorMessage = 'Unknown database error';
    
    if (error?.name === 'MongooseServerSelectionError') {
      errorMessage = `Cannot connect to MongoDB server. Please check if MongoDB is running and the connection string is correct.`;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    return {
      connected: false,
      error: errorMessage,
    };
  }
}

