/**
 * Script to create Talimul Quran user
 * Run: npx tsx scripts/create-talimul-quran.ts
 * Or: ts-node scripts/create-talimul-quran.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';
import { Admin } from '../models/Admin';
import { getDbConnection } from '../lib/db';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') }); // Fallback to .env

async function createTalimulQuran() {
  try {
    // Connect to database
    await getDbConnection();
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await Admin.findOne({ 
      $or: [
        { username: 'talimulquran' },
        { name: 'Talimul Quran' }
      ]
    });
    
    if (existingUser) {
      console.log('⚠️  Talimul Quran user already exists!');
      console.log(`📝 Username: ${existingUser.username}`);
      console.log(`📝 Name: ${existingUser.name}`);
      process.exit(0);
    }

    // Create Talimul Quran user
    const user = new Admin({
      username: 'talimulquran',
      email: 'talimulquran@nizametaleem.com',
      password: 'talimul123', // Will be hashed automatically by the model
      role: 'admin',
      name: 'Talimul Quran',
    });

    await user.save();
    console.log('✅ Talimul Quran user created successfully!');
    console.log('📝 Username: talimulquran');
    console.log('📝 Password: talimul123');
    console.log('📝 Name: Talimul Quran');
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error creating user:', error.message);
    process.exit(1);
  }
}

createTalimulQuran();



