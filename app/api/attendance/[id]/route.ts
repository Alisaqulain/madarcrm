import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { Attendance } from '@/models/Attendance';
import { requireAdmin } from '@/middleware/auth';
import { validate, attendanceSchema } from '@/lib/validation';
import { handleError, AppError } from '@/lib/errors';
import { getLanguageFromRequest, formatResponse } from '@/lib/i18n-server';

// PUT /api/attendance/[id] - Update attendance
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await getDbConnection();
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    const validation = validate(attendanceSchema.partial(), body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const data = validation.data;
    const lang = getLanguageFromRequest(request.headers);

    const attendance = await Attendance.findById(params.id);
    if (!attendance) {
      throw new AppError(404, 'Attendance record not found');
    }

    if (data.status) attendance.status = data.status;
    if (data.remarks) attendance.remarks = data.remarks;
    if (data.date) attendance.date = new Date(data.date);

    await attendance.save();

    return NextResponse.json(
      formatResponse(
        {
          id: attendance._id,
          studentId: attendance.studentId,
          date: attendance.date,
          status: attendance.status,
          remarks: attendance.remarks?.[lang] || attendance.remarks?.en || '',
        },
        lang,
        'Attendance updated successfully'
      )
    );
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/attendance/[id] - Delete attendance
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await getDbConnection();
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const lang = getLanguageFromRequest(request.headers);
    const attendance = await Attendance.findByIdAndDelete(params.id);

    if (!attendance) {
      throw new AppError(404, 'Attendance record not found');
    }

    return NextResponse.json(
      formatResponse(
        { id: attendance._id },
        lang,
        'Attendance deleted successfully'
      )
    );
  } catch (error) {
    return handleError(error);
  }
}

