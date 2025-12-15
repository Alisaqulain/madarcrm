import mongoose, { Schema, Document } from 'mongoose';

export interface IKitchen extends Document {
  date: Date;
  itemName: {
    en: string;
    hi: string;
    ur: string;
  };
  quantity: number;
  cost: number;
  totalAmount: number;
  addedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const KitchenSchema = new Schema<IKitchen>({
  date: {
    type: Date,
    required: true,
    index: true,
  },
  itemName: {
    en: { type: String, required: true },
    hi: { type: String, required: true },
    ur: { type: String, required: true },
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  cost: {
    type: Number,
    required: true,
    min: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for date-based queries
KitchenSchema.index({ date: 1, createdAt: -1 });

export const Kitchen = mongoose.models.Kitchen || mongoose.model<IKitchen>('Kitchen', KitchenSchema);

