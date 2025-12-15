import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { Student } from '@/models/Student';
import { Attendance } from '@/models/Attendance';
import { Fee } from '@/models/Fee';
import { optionalAuth } from '@/middleware/auth';
import { handleError } from '@/lib/errors';
import { getLanguageFromRequest, formatResponse } from '@/lib/i18n-server';

// GET /api/parents/search - Search students (read-only for parents)
export async function GET(request: NextRequest) {
  try {
    await getDbConnection();
    // Optional auth - parents can access without login, but logged-in users get better access
    const auth = await optionalAuth(request);

    const { searchParams } = new URL(request.url);
    const lang = getLanguageFromRequest(request.headers, searchParams);
    const search = searchParams.get('search') || '';

    if (!search || search.length < 2) {
      return NextResponse.json(
        { success: false, message: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Search by name or father name (any language)
    const students = await Student.find({
      $or: [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.hi': { $regex: search, $options: 'i' } },
        { 'name.ur': { $regex: search, $options: 'i' } },
        { 'fatherName.en': { $regex: search, $options: 'i' } },
        { 'fatherName.hi': { $regex: search, $options: 'i' } },
        { 'fatherName.ur': { $regex: search, $options: 'i' } },
      ],
      status: 'Active',
    }).limit(50);

    const formatted = students.map(student => ({
      id: student._id,
      studentId: student.studentId,
      name: student.name[lang] || student.name.en,
      fatherName: student.fatherName[lang] || student.fatherName.en,
      motherName: student.motherName[lang] || student.motherName.en,
      class: student.class,
      section: student.section,
      phone: student.phone,
    }));

    return NextResponse.json(formatResponse(formatted, lang, 'Search results retrieved successfully'));
  } catch (error) {
    return handleError(error);
  }
}

