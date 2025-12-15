import { NextResponse } from 'next/server';
import { checkDbConnection } from '@/lib/db';

/**
 * GET /api/health/db
 * Health check endpoint to verify database connection
 */
export async function GET() {
  try {
    const result = await checkDbConnection();
    
    if (result.connected) {
      return NextResponse.json(
        {
          status: 'success',
          message: 'Database connection is healthy',
          connected: true,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database connection failed',
          connected: false,
          error: result.error || 'Unknown error',
          timestamp: new Date().toISOString(),
        },
        { status: 503 } // Service Unavailable
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database health check failed',
        connected: false,
        error: error?.message || 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

