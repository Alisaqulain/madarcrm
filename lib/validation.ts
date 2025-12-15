import { z } from 'zod';

/**
 * Validation schemas using Zod
 */

export const multiLanguageSchema = z.object({
  en: z.string().min(1, 'English text is required'),
  hi: z.string().min(1, 'Hindi text is required'),
  ur: z.string().min(1, 'Urdu text is required'),
});

export const studentSchema = z.object({
  name: multiLanguageSchema,
  fatherName: multiLanguageSchema,
  motherName: multiLanguageSchema,
  class: z.string().min(1, 'Class is required'),
  section: z.string().min(1, 'Section is required'),
  dob: z.string().or(z.date()),
  address: multiLanguageSchema,
  phone: z.string().min(10, 'Valid phone number is required'),
  admissionDate: z.string().or(z.date()),
  status: z.enum(['Active', 'Inactive']).optional(),
});

export const attendanceSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  date: z.string().or(z.date()),
  status: z.enum(['Present', 'Absent']),
  remarks: z.object({
    en: z.string().optional(),
    hi: z.string().optional(),
    ur: z.string().optional(),
  }).optional(),
});

export const feeSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100),
  feeAmount: z.number().min(0),
  paidAmount: z.number().min(0).optional(),
  paymentDate: z.string().or(z.date()).optional(),
  paymentMode: z.enum(['Cash', 'Online', 'Cheque', 'Bank Transfer']).optional(),
  status: z.enum(['Paid', 'Pending']).optional(),
});

export const kitchenSchema = z.object({
  date: z.string().or(z.date()),
  itemName: multiLanguageSchema,
  quantity: z.number().min(0),
  cost: z.number().min(0),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Validate request data
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
      };
    }
    return { success: false, error: 'Validation failed' };
  }
}

