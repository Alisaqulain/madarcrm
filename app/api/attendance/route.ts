import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { Attendance } from '@/models/Attendance';
import { Student } from '@/models/Student';
import { requireAdmin } from '@/middleware/auth';
import { validate, attendanceSchema } from '@/lib/validation';
import { handleError } from '@/lib/errors';
import { getLanguageFromRequest, formatResponse } from '@/lib/i18n-server';

// GET /api/attendance - Get attendance records
export async function GET(request: NextRequest) {
  try {
    await getDbConnection();
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const lang = getLanguageFromRequest(request.headers, searchParams);
    const studentId = searchParams.get('studentId');
    const date = searchParams.get('date');
    const classFilter = searchParams.get('class');

    const query: any = {};

    if (studentId) {
      query.studentId = studentId;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    let attendanceQuery = Attendance.find(query).populate('studentId', 'name fatherName class section');

    if (classFilter) {
      attendanceQuery = attendanceQuery.where('studentId').in(
        await Student.find({ class: classFilter }).distinct('_id')
      );
    }

    const attendance = await attendanceQuery.sort({ date: -1 });

    const formatted = attendance.map(att => {
      const student = att.studentId as any;
      return {
        id: att._id,
        studentId: student?._id,
        studentName: student?.name?.[lang] || student?.name?.en || '',
        studentClass: student?.class || '',
        date: att.date,
        status: att.status,
        remarks: att.remarks?.[lang] || att.remarks?.en || '',
      };
    });

    return NextResponse.json(formatResponse(formatted, lang, 'Attendance retrieved successfully'));
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/attendance - Mark attendance
export async function POST(request: NextRequest) {
  try {
    await getDbConnection();
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    const validation = validate(attendanceSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const data = validation.data;
    const lang = getLanguageFromRequest(request.headers);

    // Check if attendance already exists for this student and date
    const date = new Date(data.date);
    date.setHours(0, 0, 0, 0);
    const endDate = new Date(data.date);
    endDate.setHours(23, 59, 59, 999);

    const existing = await Attendance.findOne({
      studentId: data.studentId,
      date: { $gte: date, $lte: endDate },
    });

    if (existing) {
      // Update existing
      existing.status = data.status;
      if (data.remarks) existing.remarks = data.remarks;
      await existing.save();

      const student = await Student.findById(data.studentId);
      return NextResponse.json(
        formatResponse(
          {
            id: existing._id,
            studentId: student?._id,
            date: existing.date,
            status: existing.status,
            remarks: existing.remarks?.[lang] || existing.remarks?.en || '',
          },
          lang,
          'Attendance updated successfully'
        )
      );
    }

    // Create new
    const attendance = new Attendance({
      studentId: data.studentId,
      date: new Date(data.date),
      status: data.status,
      remarks: data.remarks,
    });

    await attendance.save();
    const student = await Student.findById(data.studentId);

    return NextResponse.json(
      formatResponse(
        {
          id: attendance._id,
          studentId: student?._id,
          date: attendance.date,
          status: attendance.status,
          remarks: attendance.remarks?.[lang] || attendance.remarks?.en || '',
        },
        lang,
        'Attendance marked successfully'
      ),
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

