/**
 * Create Default Tenant Script
 * Creates a default tenant for single-tenant mode
 */

import mongoose from 'mongoose';
import { Tenant } from '../models/Tenant';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function createDefaultTenant() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/madrasa_crm';
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if default tenant exists
    const existingTenant = await Tenant.findOne({ name: 'Nizam-e-Taleem' });
    
    if (existingTenant) {
      console.log('ℹ️  Default tenant already exists:', existingTenant._id);
      console.log('   Name:', existingTenant.name);
      console.log('   Demo Mode:', existingTenant.demoMode);
      console.log('   Demo Data Loaded:', existingTenant.demoDataLoaded);
      await mongoose.disconnect();
      return;
    }

    // Create default tenant
    const tenant = new Tenant({
      name: 'Nizam-e-Taleem',
      isActive: true,
      demoMode: false,
      demoDataLoaded: false,
      settings: {
        primaryLanguage: 'en',
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        academicYear: '2024-25',
      },
      subscription: {
        plan: 'premium',
        startDate: new Date(),
        isActive: true,
      },
    });

    await tenant.save();
    console.log('✅ Default tenant created successfully!');
    console.log('   Tenant ID:', tenant._id);
    console.log('   Name:', tenant.name);
    console.log('\n💡 Next steps:');
    console.log('   1. Enable demo mode via API or UI');
    console.log('   2. Load demo data');
    console.log('   3. Create admin user with this tenantId');

    await mongoose.disconnect();
  } catch (error: any) {
    console.error('❌ Error creating default tenant:', error.message);
    process.exit(1);
  }
}

createDefaultTenant();

