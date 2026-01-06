import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@/auth';

// GET - Fetch reviews (public endpoint for approved reviews, admin endpoint for all reviews)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminView = searchParams.get('admin') === 'true';
    
    let query = 'SELECT * FROM Review';
    let params: any[] = [];

    if (adminView) {
      // Admin view - check authentication
      const session = await auth();
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      // Show all reviews for admin
      query += ' ORDER BY createdAt DESC';
    } else {
      // Public view - only approved reviews
      query += ' WHERE isApproved = ? ORDER BY createdAt DESC';
      params = [true];
    }

    const [rows] = await pool.query(query, params);
    const reviews = rows as any[];

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Create new review (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const { author, content, rating } = await request.json();

    // Validate required fields
    if (!author || !content) {
      return NextResponse.json(
        { error: 'Author and content are required' },
        { status: 400 }
      );
    }

    // Validate rating
    const reviewRating = rating || 5;
    if (reviewRating < 1 || reviewRating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create new review
    const reviewId = `review_${Date.now()}`;
    await pool.query(
      'INSERT INTO Review (id, author, content, rating, isApproved, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
      [reviewId, author, content, reviewRating, false] // Default to not approved
    );

    // Fetch the created review
    const [rows] = await pool.query('SELECT * FROM Review WHERE id = ?', [reviewId]);
    const review = (rows as any[])[0];

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}