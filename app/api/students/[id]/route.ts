import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { Student } from '@/models/Student';
import { requireAdmin } from '@/middleware/auth';
import { validate, studentSchema } from '@/lib/validation';
import { handleError, AppError } from '@/lib/errors';
import { getLanguageFromRequest, formatResponse } from '@/lib/i18n-server';

// GET /api/students/[id] - Get single student
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await getDbConnection();
    // Make auth optional for demo/development mode
    const auth = await requireAdmin(request, true);
    // Allow demo mode access

    const lang = getLanguageFromRequest(request.headers);
    const student = await Student.findById(params.id);

    if (!student) {
      throw new AppError(404, 'Student not found');
    }

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
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,
        },
        lang,
        'Student retrieved successfully'
      )
    );
  } catch (error) {
    return handleError(error);
  }
}

// PUT /api/students/[id] - Update student
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await getDbConnection();
    // Make auth optional for demo/development mode
    const auth = await requireAdmin(request, true);
    // Allow demo mode access

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

    const student = await Student.findById(params.id);
    if (!student) {
      throw new AppError(404, 'Student not found');
    }

    // Update student
    student.name = data.name;
    student.fatherName = data.fatherName;
    student.motherName = data.motherName;
    student.class = data.class;
    student.section = data.section;
    student.dob = new Date(data.dob);
    student.address = data.address;
    student.phone = data.phone;
    student.admissionDate = new Date(data.admissionDate);
    if (data.status) student.status = data.status;

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
        'Student updated successfully'
      )
    );
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/students/[id] - Delete student
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await getDbConnection();
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const lang = getLanguageFromRequest(request.headers);
    const student = await Student.findByIdAndDelete(params.id);

    if (!student) {
      throw new AppError(404, 'Student not found');
    }

    return NextResponse.json(
      formatResponse(
        { id: student._id, studentId: student.studentId },
        lang,
        'Student deleted successfully'
      )
    );
  } catch (error) {
    return handleError(error);
  }
}

