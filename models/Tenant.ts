import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  subdomain?: string;
  domain?: string;
  isActive: boolean;
  demoMode: boolean;
  demoDataLoaded: boolean;
  settings: {
    primaryLanguage: 'en' | 'hi' | 'ur';
    timezone: string;
    currency: string;
    academicYear: string;
  };
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema = new Schema<ITenant>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  subdomain: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  domain: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  demoMode: {
    type: Boolean,
    default: false,
    index: true,
  },
  demoDataLoaded: {
    type: Boolean,
    default: false,
  },
  settings: {
    primaryLanguage: {
      type: String,
      enum: ['en', 'hi', 'ur'],
      default: 'en',
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
    currency: {
      type: String,
      default: 'INR',
    },
    academicYear: {
      type: String,
      default: '2024-25',
    },
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
}, {
  timestamps: true,
});

// Indexes
TenantSchema.index({ subdomain: 1 });
TenantSchema.index({ domain: 1 });
TenantSchema.index({ isActive: 1, demoMode: 1 });

export const Tenant = mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);

