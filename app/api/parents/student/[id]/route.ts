import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { Student } from '@/models/Student';
import { Attendance } from '@/models/Attendance';
import { Fee } from '@/models/Fee';
import { optionalAuth } from '@/middleware/auth';
import { handleError, AppError } from '@/lib/errors';
import { getLanguageFromRequest, formatResponse } from '@/lib/i18n-server';

// GET /api/parents/student/[id] - Get student profile with reports (read-only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await getDbConnection();
    await optionalAuth(request); // Optional - parents can view without login

    const { searchParams } = new URL(request.url);
    const lang = getLanguageFromRequest(request.headers, searchParams);

    const student = await Student.findById(params.id);
    if (!student) {
      throw new AppError(404, 'Student not found');
    }

    // Get attendance summary
    const attendanceRecords = await Attendance.find({ studentId: params.id })
      .sort({ date: -1 })
      .limit(30);

    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(a => a.status === 'Present').length;
    const absentDays = attendanceRecords.filter(a => a.status === 'Absent').length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    // Get fees history
    const fees = await Fee.find({ studentId: params.id })
      .sort({ year: -1, month: -1 });

    const totalPaid = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);
    const totalPending = fees.reduce((sum, fee) => sum + fee.dueAmount, 0);
    const pendingFees = fees.filter(f => f.status === 'Pending');

    const response = {
      profile: {
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
      attendance: {
        totalDays,
        presentDays,
        absentDays,
        attendancePercentage: Math.round(attendancePercentage * 100) / 100,
        recentRecords: attendanceRecords.slice(0, 10).map(att => ({
          date: att.date,
          status: att.status,
          remarks: att.remarks?.[lang] || att.remarks?.en || '',
        })),
      },
      fees: {
        totalPaid,
        totalPending,
        pendingCount: pendingFees.length,
        history: fees.map(fee => ({
          month: fee.month,
          year: fee.year,
          feeAmount: fee.feeAmount,
          paidAmount: fee.paidAmount,
          dueAmount: fee.dueAmount,
          status: fee.status,
          paymentDate: fee.paymentDate,
          paymentMode: fee.paymentMode,
        })),
        pendingDues: pendingFees.map(fee => ({
          month: fee.month,
          year: fee.year,
          dueAmount: fee.dueAmount,
        })),
      },
    };

    return NextResponse.json(formatResponse(response, lang, 'Student report retrieved successfully'));
  } catch (error) {
    return handleError(error);
  }
}

