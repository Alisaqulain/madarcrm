import mongoose, { Schema, Document } from 'mongoose';

export interface IFee extends Document {
  studentId: mongoose.Types.ObjectId;
  month: number; // 1-12
  year: number;
  feeAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentDate?: Date;
  paymentMode?: 'Cash' | 'Online' | 'Cheque' | 'Bank Transfer';
  status: 'Paid' | 'Pending';
  tenantId?: mongoose.Types.ObjectId;
  isDemoData: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeeSchema = new Schema<IFee>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true,
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
    index: true,
  },
  feeAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paidAmount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  dueAmount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  paymentDate: {
    type: Date,
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'Online', 'Cheque', 'Bank Transfer'],
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending'],
    default: 'Pending',
    index: true,
  },
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    index: true,
  },
  isDemoData: {
    type: Boolean,
    default: false,
    index: true,
  },
}, {
  timestamps: true,
});

// Compound index for unique fee per student per month/year
FeeSchema.index({ studentId: 1, month: 1, year: 1 }, { unique: true });

export const Fee = mongoose.models.Fee || mongoose.model<IFee>('Fee', FeeSchema);

