import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { Student } from '@/models/Student';
import { requireAdmin } from '@/middleware/auth';
import { validate, studentSchema } from '@/lib/validation';
import { handleError, generateStudentId } from '@/lib/errors';
import { getLanguageFromRequest, formatResponse } from '@/lib/i18n-server';

// GET /api/students - Get all students with optional search
export async function GET(request: NextRequest) {
  try {
    await getDbConnection();
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const lang = getLanguageFromRequest(request.headers, searchParams);
    const search = searchParams.get('search') || '';
    const classFilter = searchParams.get('class') || '';
    const status = searchParams.get('status') || '';

    const query: any = {};

    // Search by name or father name (any language)
    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.hi': { $regex: search, $options: 'i' } },
        { 'name.ur': { $regex: search, $options: 'i' } },
        { 'fatherName.en': { $regex: search, $options: 'i' } },
        { 'fatherName.hi': { $regex: search, $options: 'i' } },
        { 'fatherName.ur': { $regex: search, $options: 'i' } },
      ];
    }

    if (classFilter) {
      query.class = classFilter;
    }

    if (status) {
      query.status = status;
    }

    const students = await Student.find(query).sort({ createdAt: -1 });

    const formattedStudents = students.map(student => ({
      id: student._id,
      studentId: student.studentId,
      name: student.name[lang] || student.name.en,
      fatherName: student.fatherName[lang] || student.fatherName.en,
      motherName: student.motherName[lang] || student.motherName.en,
      class: student.class,
      section: student.section,
      dob: student.dob,
      address: student.address[lang] || student.address.en,
      phone: student.phone,
      admissionDate: student.admissionDate,
      status: student.status,
      createdAt: student.createdAt,
    }));

    return NextResponse.json(formatResponse(formattedStudents, lang, 'Students retrieved successfully'));
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/students - Add new student
export async function POST(request: NextRequest) {
  try {
    await getDbConnection();
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    const validation = validate(studentSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const data = validation.data;
    const lang = getLanguageFromRequest(request.headers);

    // Generate student ID
    const studentId = await generateStudentId();

    // Create student
    const student = new Student({
      studentId,
      name: data.name,
      fatherName: data.fatherName,
      motherName: data.motherName,
      class: data.class,
      section: data.section,
      dob: new Date(data.dob),
      address: data.address,
      phone: data.phone,
      admissionDate: new Date(data.admissionDate),
      status: data.status || 'Active',
    });

    await student.save();

    return NextResponse.json(
      formatResponse(
        {
          id: student._id,
          studentId: student.studentId,
          name: student.name[lang] || student.name.en,
          fatherName: student.fatherName[lang] || student.fatherName.en,
          motherName: student.motherName[lang] || student.motherName.en,
          class: student.class,
          section: student.section,
          dob: student.dob,
          address: student.address[lang] || student.address.en,
          phone: student.phone,
          admissionDate: student.admissionDate,
          status: student.status,
        },
        lang,
        'Student added successfully'
      ),
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

