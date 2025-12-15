import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { Fee } from '@/models/Fee';
import { requireAdmin } from '@/middleware/auth';
import { handleError } from '@/lib/errors';
import { getLanguageFromRequest, formatResponse } from '@/lib/i18n-server';

// GET /api/fees/reports - Get fee reports
export async function GET(request: NextRequest) {
  try {
    await getDbConnection();
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const lang = getLanguageFromRequest(request.headers, searchParams);
    const type = searchParams.get('type') || 'monthly'; // monthly, pending, student

    let report: any = {};

    if (type === 'monthly') {
      const month = searchParams.get('month');
      const year = searchParams.get('year') || new Date().getFullYear();

      const query: any = { year: parseInt(year as string) };
      if (month) query.month = parseInt(month);

      const fees = await Fee.find(query);
      const totalCollection = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);
      const totalPending = fees.reduce((sum, fee) => sum + fee.dueAmount, 0);

      report = {
        month: month ? parseInt(month) : null,
        year: parseInt(year as string),
        totalCollection,
        totalPending,
        totalStudents: fees.length,
        paidCount: fees.filter(f => f.status === 'Paid').length,
        pendingCount: fees.filter(f => f.status === 'Pending').length,
      };
    } else if (type === 'pending') {
      const pendingFees = await Fee.find({ status: 'Pending' })
        .populate('studentId', 'name fatherName class section studentId')
        .sort({ year: -1, month: -1 });

      report = {
        totalPending: pendingFees.reduce((sum, fee) => sum + fee.dueAmount, 0),
        count: pendingFees.length,
        fees: pendingFees.map(fee => {
          const student = fee.studentId as any;
          return {
            id: fee._id,
            studentId: student?._id,
            studentName: student?.name?.[lang] || student?.name?.en || '',
            studentClass: student?.class || '',
            month: fee.month,
            year: fee.year,
            dueAmount: fee.dueAmount,
          };
        }),
      };
    } else if (type === 'student') {
      const studentId = searchParams.get('studentId');
      if (!studentId) {
        return NextResponse.json(
          { success: false, message: 'Student ID is required' },
          { status: 400 }
        );
      }

      const studentFees = await Fee.find({ studentId })
        .sort({ year: -1, month: -1 });

      const totalPaid = studentFees.reduce((sum, fee) => sum + fee.paidAmount, 0);
      const totalPending = studentFees.reduce((sum, fee) => sum + fee.dueAmount, 0);

      report = {
        studentId,
        totalPaid,
        totalPending,
        fees: studentFees,
      };
    }

    return NextResponse.json(formatResponse(report, lang, 'Fee report retrieved successfully'));
  } catch (error) {
    return handleError(error);
  }
}

