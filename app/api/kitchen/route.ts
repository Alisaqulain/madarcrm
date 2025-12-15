import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { Kitchen } from '@/models/Kitchen';
import { requireAdmin } from '@/middleware/auth';
import { validate, kitchenSchema } from '@/lib/validation';
import { handleError } from '@/lib/errors';
import { getLanguageFromRequest, formatResponse } from '@/lib/i18n-server';

// GET /api/kitchen - Get kitchen expenses
export async function GET(request: NextRequest) {
  try {
    await getDbConnection();
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const lang = getLanguageFromRequest(request.headers, searchParams);
    const date = searchParams.get('date');
    const month = searchParams.get('month');
    const year = searchParams.get('year') || new Date().getFullYear();

    const query: any = {};

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    } else if (month) {
      const startDate = new Date(parseInt(year as string), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year as string), parseInt(month), 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    } else if (year) {
      const startDate = new Date(parseInt(year as string), 0, 1);
      const endDate = new Date(parseInt(year as string), 11, 31, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const expenses = await Kitchen.find(query)
      .populate('addedBy', 'name username')
      .sort({ date: -1 });

    const formatted = expenses.map(expense => {
      const addedBy = expense.addedBy as any;
      return {
        id: expense._id,
        date: expense.date,
        itemName: expense.itemName[lang] || expense.itemName.en,
        quantity: expense.quantity,
        cost: expense.cost,
        totalAmount: expense.totalAmount,
        addedBy: addedBy?.name || addedBy?.username || '',
        createdAt: expense.createdAt,
      };
    });

    return NextResponse.json(formatResponse(formatted, lang, 'Kitchen expenses retrieved successfully'));
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/kitchen - Add kitchen expense
export async function POST(request: NextRequest) {
  try {
    await getDbConnection();
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    const validation = validate(kitchenSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const data = validation.data;
    const lang = getLanguageFromRequest(request.headers);

    const totalAmount = data.quantity * data.cost;

    const expense = new Kitchen({
      date: new Date(data.date),
      itemName: data.itemName,
      quantity: data.quantity,
      cost: data.cost,
      totalAmount: totalAmount,
      addedBy: auth.user!.id,
    });

    await expense.save();
    await expense.populate('addedBy', 'name username');

    const addedBy = expense.addedBy as any;

    return NextResponse.json(
      formatResponse(
        {
          id: expense._id,
          date: expense.date,
          itemName: expense.itemName[lang] || expense.itemName.en,
          quantity: expense.quantity,
          cost: expense.cost,
          totalAmount: expense.totalAmount,
          addedBy: addedBy?.name || addedBy?.username || '',
        },
        lang,
        'Kitchen expense added successfully'
      ),
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

