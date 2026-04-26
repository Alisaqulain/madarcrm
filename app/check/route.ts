import { NextResponse } from 'next/server';
import { checkDbConnection } from '@/lib/db';

/**
 * GET /check
 * Quick DB connectivity check (open in browser or curl).
 */
export async function GET() {
  const db = await checkDbConnection();
  const body = {
    ok: db.connected,
    database: {
      connected: db.connected,
      ...(db.error ? { error: db.error } : {}),
    },
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body, { status: db.connected ? 200 : 503 });
}
