/**
 * Demo Mode Management API
 * Toggle demo mode and manage demo data
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { Tenant } from '@/models/Tenant';
import { generateDemoData, clearDemoData } from '@/lib/demo-data-generator';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await getDbConnection();
    
    const body = await request.json();
    const { tenantId, action } = body;
    
    if (!tenantId || !mongoose.Types.ObjectId.isValid(tenantId)) {
      return NextResponse.json(
        { error: 'Invalid tenant ID' },
        { status: 400 }
      );
    }
    
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }
    
    if (action === 'enable') {
      // Enable demo mode and load demo data
      tenant.demoMode = true;
      await tenant.save();
      
      if (!tenant.demoDataLoaded) {
        const stats = await generateDemoData(tenant._id);
        return NextResponse.json({
          success: true,
          message: 'Demo mode enabled and data loaded',
          stats
        });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Demo mode enabled'
      });
    } else if (action === 'disable') {
      // Disable demo mode (keep data, just mark as disabled)
      tenant.demoMode = false;
      await tenant.save();
      
      return NextResponse.json({
        success: true,
        message: 'Demo mode disabled'
      });
    } else if (action === 'load') {
      // Load demo data
      if (tenant.demoDataLoaded) {
        return NextResponse.json({
          success: false,
          message: 'Demo data already loaded. Clear existing data first.'
        }, { status: 400 });
      }
      
      const stats = await generateDemoData(tenant._id);
      return NextResponse.json({
        success: true,
        message: 'Demo data loaded successfully',
        stats
      });
    } else if (action === 'clear') {
      // Clear demo data
      await clearDemoData(tenant._id);
      return NextResponse.json({
        success: true,
        message: 'Demo data cleared successfully'
      });
    } else if (action === 'reset') {
      // Clear and reload demo data
      await clearDemoData(tenant._id);
      const stats = await generateDemoData(tenant._id);
      return NextResponse.json({
        success: true,
        message: 'Demo data reset successfully',
        stats
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Demo mode API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await getDbConnection();
    
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    
    if (!tenantId || !mongoose.Types.ObjectId.isValid(tenantId)) {
      return NextResponse.json(
        { error: 'Invalid tenant ID' },
        { status: 400 }
      );
    }
    
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      demoMode: tenant.demoMode || false,
      demoDataLoaded: tenant.demoDataLoaded || false
    });
  } catch (error: any) {
    console.error('Demo mode GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

