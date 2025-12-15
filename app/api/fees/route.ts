import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { Fee } from '@/models/Fee';
import { Student } from '@/models/Student';
import { requireAdmin } from '@/middleware/auth';
import { validate, feeSchema } from '@/lib/validation';
import { handleError } from '@/lib/errors';
import { getLanguageFromRequest, formatResponse } from '@/lib/i18n-server';

// GET /api/fees - Get fees records
export async function GET(request: NextRequest) {
  try {
    await getDbConnection();
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const lang = getLanguageFromRequest(request.headers, searchParams);
    const studentId = searchParams.get('studentId');
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const status = searchParams.get('status');

    const query: any = {};

    if (studentId) query.studentId = studentId;
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);
    if (status) query.status = status;

    const fees = await Fee.find(query)
      .populate('studentId', 'name fatherName class section studentId')
      .sort({ year: -1, month: -1 });

    const formatted = fees.map(fee => {
      const student = fee.studentId as any;
      return {
        id: fee._id,
        studentId: student?._id,
        studentName: student?.name?.[lang] || student?.name?.en || '',
        studentClass: student?.class || '',
        month: fee.month,
        year: fee.year,
        feeAmount: fee.feeAmount,
        paidAmount: fee.paidAmount,
        dueAmount: fee.dueAmount,
        paymentDate: fee.paymentDate,
        paymentMode: fee.paymentMode,
        status: fee.status,
      };
    });

    return NextResponse.json(formatResponse(formatted, lang, 'Fees retrieved successfully'));
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/fees - Add/Update fee
export async function POST(request: NextRequest) {
  try {
    await getDbConnection();
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    const validation = validate(feeSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const data = validation.data;
    const lang = getLanguageFromRequest(request.headers);

    // Calculate due amount
    const paidAmount = data.paidAmount || 0;
    const dueAmount = data.feeAmount - paidAmount;
    const status = dueAmount <= 0 ? 'Paid' : (data.status || 'Pending');

    // Check if fee already exists
    const existing = await Fee.findOne({
      studentId: data.studentId,
      month: data.month,
      year: data.year,
    });

    if (existing) {
      // Update existing
      existing.feeAmount = data.feeAmount;
      existing.paidAmount = paidAmount;
      existing.dueAmount = dueAmount;
      existing.status = status;
      if (data.paymentDate) existing.paymentDate = new Date(data.paymentDate);
      if (data.paymentMode) existing.paymentMode = data.paymentMode;
      await existing.save();

      const student = await Student.findById(data.studentId);
      return NextResponse.json(
        formatResponse(
          {
            id: existing._id,
            studentId: student?._id,
            month: existing.month,
            year: existing.year,
            feeAmount: existing.feeAmount,
            paidAmount: existing.paidAmount,
            dueAmount: existing.dueAmount,
            status: existing.status,
          },
          lang,
          'Fee updated successfully'
        )
      );
    }

    // Create new
    const fee = new Fee({
      studentId: data.studentId,
      month: data.month,
      year: data.year,
      feeAmount: data.feeAmount,
      paidAmount: paidAmount,
      dueAmount: dueAmount,
      paymentDate: data.paymentDate ? new Date(data.paymentDate) : undefined,
      paymentMode: data.paymentMode,
      status: status,
    });

    await fee.save();
    const student = await Student.findById(data.studentId);

    return NextResponse.json(
      formatResponse(
        {
          id: fee._id,
          studentId: student?._id,
          month: fee.month,
          year: fee.year,
          feeAmount: fee.feeAmount,
          paidAmount: fee.paidAmount,
          dueAmount: fee.dueAmount,
          status: fee.status,
        },
        lang,
        'Fee added successfully'
      ),
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

