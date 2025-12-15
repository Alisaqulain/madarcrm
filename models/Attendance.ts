import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  date: Date;
  status: 'Present' | 'Absent';
  remarks?: {
    en?: string;
    hi?: string;
    ur?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true,
  },
  remarks: {
    en: String,
    hi: String,
    ur: String,
  },
}, {
  timestamps: true,
});

// Compound index for unique attendance per student per date
AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);

