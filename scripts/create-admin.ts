/**
 * Script to create initial admin user
 * Run: npx tsx scripts/create-admin.ts
 * Or: ts-node scripts/create-admin.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';
import { Admin } from '../models/Admin';
import { getDbConnection } from '../lib/db';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') }); // Fallback to .env

async function createAdmin() {
  try {
    // Connect to database
    await getDbConnection();
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      process.exit(0);
    }

    // Create admin user
    const admin = new Admin({
      username: 'admin',
      email: 'admin@madrasa.com',
      password: 'admin123', // Will be hashed automatically by the model
      role: 'admin',
      name: 'Administrator',
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📝 Username: admin');
    console.log('📝 Password: admin123');
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();

