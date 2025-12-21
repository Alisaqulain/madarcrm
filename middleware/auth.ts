import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Admin } from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends NextRequest {
  user?: {
    id: string;
    username: string;
    role: 'admin' | 'parent';
  };
}

export interface JWTPayload {
  id: string;
  username: string;
  role: 'admin' | 'parent';
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Get token from request
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookie
  const token = request.cookies.get('token')?.value;
  if (token) return token;

  return null;
}

/**
 * Authentication middleware
 * For demo/development mode, allows requests without token
 */
export async function authenticate(
  request: NextRequest,
  requiredRole?: 'admin' | 'parent',
  allowUnauthenticated: boolean = true // Allow unauthenticated access for demo mode
): Promise<{ user: JWTPayload | null; error: null } | { user: null; error: NextResponse | null }> {
  const token = getTokenFromRequest(request);

  // If no token and unauthenticated access is allowed, return success with null user
  if (!token) {
    if (allowUnauthenticated) {
      return { user: null, error: null };
    }
    return {
      user: null,
      error: NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      ),
    };
  }

  const payload = verifyToken(token);
  if (!payload) {
    // If token exists but is invalid, and unauthenticated is allowed, allow access (for demo mode)
    // This handles expired tokens in demo mode
    if (allowUnauthenticated) {
      return { user: null, error: null };
    }
    return {
      user: null,
      error: NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      ),
    };
  }

  // Verify user still exists
  try {
    await import('@/lib/db').then(m => m.getDbConnection());
    const user = await Admin.findById(payload.id);
    
    if (!user) {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 401 }
        ),
      };
    }

    // Check role if required
    if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, message: 'Insufficient permissions' },
          { status: 403 }
        ),
      };
    }

    return { user: payload, error: null };
  } catch (error) {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, message: 'Authentication error' },
        { status: 500 }
      ),
    };
  }
}

/**
 * Require admin role (but allow unauthenticated for demo mode)
 */
export async function requireAdmin(request: NextRequest, allowUnauthenticated: boolean = true) {
  return authenticate(request, 'admin', allowUnauthenticated);
}

/**
 * Optional authentication (for parent access)
 */
export async function optionalAuth(request: NextRequest): Promise<JWTPayload | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  const payload = verifyToken(token);
  return payload;
}

