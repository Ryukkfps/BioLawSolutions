import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminView = searchParams.get('admin') === 'true';
    
    if (adminView) {
      const session = await auth();
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      const reviews = await prisma.review.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(reviews);
    } else {
      const reviews = await prisma.review.findMany({
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(reviews);
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { author, content, rating } = await request.json();

    if (!author || !content) {
      return NextResponse.json(
        { error: 'Author and content are required' },
        { status: 400 }
      );
    }

    const reviewRating = rating || 5;
    if (reviewRating < 1 || reviewRating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        author,
        content,
        rating: reviewRating,
        isApproved: false
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
