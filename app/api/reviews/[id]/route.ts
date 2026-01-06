import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@/auth';

// PUT - Update review (admin only - mainly for approval)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { isApproved } = await request.json();
    const params = await context.params;
    const reviewId = params.id;

    // Update review approval status
    await pool.query(
      'UPDATE Review SET isApproved = ? WHERE id = ?',
      [isApproved, reviewId]
    );

    // Fetch the updated review
    const [rows] = await pool.query('SELECT * FROM Review WHERE id = ?', [reviewId]);
    const review = (rows as any[])[0];

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE - Delete review (admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const reviewId = params.id;

    // Check if review exists
    const [rows] = await pool.query('SELECT * FROM Review WHERE id = ?', [reviewId]);
    const review = (rows as any[])[0];

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Delete the review
    await pool.query('DELETE FROM Review WHERE id = ?', [reviewId]);

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}