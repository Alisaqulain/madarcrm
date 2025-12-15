import mongoose, { Schema, Document } from 'mongoose';

export interface IMultiLanguage {
  en: string;
  hi: string;
  ur: string;
}

export interface IStudent extends Document {
  studentId: string;
  name: IMultiLanguage;
  fatherName: IMultiLanguage;
  motherName: IMultiLanguage;
  class: string;
  section: string;
  dob: Date;
  address: IMultiLanguage;
  phone: string;
  admissionDate: Date;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const MultiLanguageSchema = new Schema<IMultiLanguage>({
  en: { type: String, required: true },
  hi: { type: String, required: true },
  ur: { type: String, required: true },
}, { _id: false });

const StudentSchema = new Schema<IStudent>({
  studentId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: MultiLanguageSchema,
    required: true,
  },
  fatherName: {
    type: MultiLanguageSchema,
    required: true,
  },
  motherName: {
    type: MultiLanguageSchema,
    required: true,
  },
  class: {
    type: String,
    required: true,
    index: true,
  },
  section: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  address: {
    type: MultiLanguageSchema,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  admissionDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
    index: true,
  },
}, {
  timestamps: true,
});

// Indexes for multi-language search
StudentSchema.index({ 'name.en': 'text', 'name.hi': 'text', 'name.ur': 'text' });
StudentSchema.index({ 'fatherName.en': 'text', 'fatherName.hi': 'text', 'fatherName.ur': 'text' });
StudentSchema.index({ 'name.en': 1, 'name.hi': 1, 'name.ur': 1 });
StudentSchema.index({ 'fatherName.en': 1, 'fatherName.hi': 1, 'fatherName.ur': 1 });

export const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

