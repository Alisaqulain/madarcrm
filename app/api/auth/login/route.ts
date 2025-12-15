import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { Admin } from '@/models/Admin';
import { generateToken } from '@/middleware/auth';
import { validate, loginSchema } from '@/lib/validation';
import { handleError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    await getDbConnection();

    const body = await request.json();
    const validation = validate(loginSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const { username, password } = validation.data;

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [{ username }, { email: username.toLowerCase() }],
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      id: admin._id.toString(),
      username: admin.username,
      role: admin.role,
    });

    // Set cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: admin._id.toString(),
          username: admin.username,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return handleError(error);
  }
}

