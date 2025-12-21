/**
 * Multi-Tenant Context Management
 * Handles tenant isolation and context switching
 */

import { headers } from 'next/headers';
import { Tenant } from '@/models/Tenant';
import mongoose from 'mongoose';

export interface TenantContext {
  tenantId: mongoose.Types.ObjectId;
  tenant: any;
  isDemoMode: boolean;
}

/**
 * Get tenant from request headers (subdomain, domain, or tenant-id header)
 */
export async function getTenantContext(): Promise<TenantContext | null> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || '';
    const tenantIdHeader = headersList.get('x-tenant-id');
    
    let tenant;
    
    // Try to get tenant by header first
    if (tenantIdHeader && mongoose.Types.ObjectId.isValid(tenantIdHeader)) {
      tenant = await Tenant.findById(tenantIdHeader);
      if (tenant && tenant.isActive) {
        return {
          tenantId: tenant._id,
          tenant,
          isDemoMode: tenant.demoMode || false
        };
      }
    }
    
    // Try subdomain
    const subdomain = host.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
      tenant = await Tenant.findOne({ subdomain, isActive: true });
      if (tenant) {
        return {
          tenantId: tenant._id,
          tenant,
          isDemoMode: tenant.demoMode || false
        };
      }
    }
    
    // Try domain
    tenant = await Tenant.findOne({ domain: host, isActive: true });
    if (tenant) {
      return {
        tenantId: tenant._id,
        tenant,
        isDemoMode: tenant.demoMode || false
      };
    }
    
    // Default tenant (for single-tenant mode)
    tenant = await Tenant.findOne({ isActive: true });
    if (tenant) {
      return {
        tenantId: tenant._id,
        tenant,
        isDemoMode: tenant.demoMode || false
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting tenant context:', error);
    return null;
  }
}

/**
 * Add tenant filter to query
 */
export function addTenantFilter(query: any, tenantId: mongoose.Types.ObjectId) {
  return { ...query, tenantId };
}

