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
      const content = await prisma.content.findMany({
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' }
        ]
      });
      return NextResponse.json(content);
    } else {
      const content = await prisma.content.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      });
      return NextResponse.json(content);
    }
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      title, 
      subtitle, 
      description, 
      backgroundImage, 
      ctaText, 
      ctaLink, 
      textColor, 
      overlayOpacity, 
      order, 
      isActive 
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    if (!backgroundImage) {
      return NextResponse.json(
        { error: 'Background image is required' },
        { status: 400 }
      );
    }

    const content = await prisma.content.create({
      data: {
        title,
        subtitle: subtitle || null,
        description,
        backgroundImage,
        ctaText: ctaText || null,
        ctaLink: ctaLink || null,
        textColor: textColor || 'white',
        overlayOpacity: overlayOpacity || 0.5,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}
