import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { Kitchen } from '@/models/Kitchen';
import { requireAdmin } from '@/middleware/auth';
import { validate, kitchenSchema } from '@/lib/validation';
import { handleError, AppError } from '@/lib/errors';
import { getLanguageFromRequest, formatResponse } from '@/lib/i18n-server';

// PUT /api/kitchen/[id] - Update kitchen expense
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await getDbConnection();
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    const validation = validate(kitchenSchema.partial(), body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const data = validation.data;
    const lang = getLanguageFromRequest(request.headers);

    const expense = await Kitchen.findById(params.id);
    if (!expense) {
      throw new AppError(404, 'Kitchen expense not found');
    }

    if (data.date) expense.date = new Date(data.date);
    if (data.itemName) expense.itemName = data.itemName;
    if (data.quantity !== undefined) expense.quantity = data.quantity;
    if (data.cost !== undefined) expense.cost = data.cost;

    expense.totalAmount = expense.quantity * expense.cost;
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
        'Kitchen expense updated successfully'
      )
    );
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/kitchen/[id] - Delete kitchen expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await getDbConnection();
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const lang = getLanguageFromRequest(request.headers);
    const expense = await Kitchen.findByIdAndDelete(params.id);

    if (!expense) {
      throw new AppError(404, 'Kitchen expense not found');
    }

    return NextResponse.json(
      formatResponse(
        { id: expense._id },
        lang,
        'Kitchen expense deleted successfully'
      )
    );
  } catch (error) {
    return handleError(error);
  }
}

