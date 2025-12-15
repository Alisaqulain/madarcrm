import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { Student } from '@/models/Student';
import { Attendance } from '@/models/Attendance';
import { Fee } from '@/models/Fee';
import { Kitchen } from '@/models/Kitchen';
import { requireAdmin } from '@/middleware/auth';
import { handleError } from '@/lib/errors';
import { getLanguageFromRequest, formatResponse } from '@/lib/i18n-server';

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    await getDbConnection();
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const lang = getLanguageFromRequest(request.headers, searchParams);
    const month = searchParams.get('month');
    const year = searchParams.get('year') || new Date().getFullYear();

    // Total students
    const totalStudents = await Student.countDocuments({ status: 'Active' });
    const inactiveStudents = await Student.countDocuments({ status: 'Inactive' });

    // Today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow },
    });

    const todayPresent = todayAttendance.filter(a => a.status === 'Present').length;
    const todayAbsent = todayAttendance.filter(a => a.status === 'Absent').length;

    // Monthly fee collection
    const feeMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const feeYear = parseInt(year as string);

    const monthlyFees = await Fee.find({
      month: feeMonth,
      year: feeYear,
    });

    const monthlyCollection = monthlyFees.reduce((sum, fee) => sum + fee.paidAmount, 0);
    const monthlyPending = monthlyFees.reduce((sum, fee) => sum + fee.dueAmount, 0);

    // Total pending fees
    const allPendingFees = await Fee.find({ status: 'Pending' });
    const totalPendingFees = allPendingFees.reduce((sum, fee) => sum + fee.dueAmount, 0);

    // Monthly kitchen expenses
    const kitchenStartDate = new Date(feeYear, feeMonth - 1, 1);
    const kitchenEndDate = new Date(feeYear, feeMonth, 0, 23, 59, 59);

    const monthlyKitchenExpenses = await Kitchen.find({
      date: { $gte: kitchenStartDate, $lte: kitchenEndDate },
    });

    const totalKitchenExpenses = monthlyKitchenExpenses.reduce(
      (sum, expense) => sum + expense.totalAmount,
      0
    );

    const stats = {
      students: {
        total: totalStudents,
        active: totalStudents,
        inactive: inactiveStudents,
      },
      attendance: {
        today: {
          present: todayPresent,
          absent: todayAbsent,
          total: todayPresent + todayAbsent,
        },
      },
      fees: {
        monthly: {
          month: feeMonth,
          year: feeYear,
          collection: monthlyCollection,
          pending: monthlyPending,
          totalStudents: monthlyFees.length,
          paidCount: monthlyFees.filter(f => f.status === 'Paid').length,
          pendingCount: monthlyFees.filter(f => f.status === 'Pending').length,
        },
        totalPending: totalPendingFees,
        pendingCount: allPendingFees.length,
      },
      kitchen: {
        month: feeMonth,
        year: feeYear,
        totalExpenses: totalKitchenExpenses,
        expenseCount: monthlyKitchenExpenses.length,
      },
    };

    return NextResponse.json(formatResponse(stats, lang, 'Dashboard statistics retrieved successfully'));
  } catch (error) {
    return handleError(error);
  }
}

