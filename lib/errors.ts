import { NextResponse } from 'next/server';

/**
 * Custom error handler
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Handle errors and return appropriate response
 */
export function handleError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'An error occurred',
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: 'An unexpected error occurred',
    },
    { status: 500 }
  );
}

/**
 * Generate student ID
 */
export async function generateStudentId(): Promise<string> {
  const { Student } = await import('@/models/Student');
  await import('@/lib/db').then(m => m.getDbConnection());
  
  const year = new Date().getFullYear();
  const lastStudent = await Student.findOne({ studentId: new RegExp(`^${year}`) })
    .sort({ studentId: -1 })
    .limit(1);

  if (lastStudent) {
    const lastNumber = parseInt(lastStudent.studentId.slice(-4)) || 0;
    return `${year}${String(lastNumber + 1).padStart(4, '0')}`;
  }

  return `${year}0001`;
}

