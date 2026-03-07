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
      const sectors = await prisma.sector.findMany({
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' }
        ]
      });
      return NextResponse.json(sectors);
    } else {
      const sectors = await prisma.sector.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      });
      return NextResponse.json(sectors);
    }
  } catch (error) {
    console.error('Error fetching sectors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sectors' },
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
      detailedDescription,
      backgroundImage,
      ctaText,
      ctaLink,
      textColor,
      overlayOpacity,
      styleType,
      order, 
      icon,
      isActive 
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const sector = await prisma.sector.create({
      data: {
        title,
        subtitle: subtitle || null,
        description,
        detailedDescription: detailedDescription || null,
        backgroundImage: backgroundImage || null,
        ctaText: ctaText || null,
        ctaLink: ctaLink || null,
        textColor: textColor || "black",
        overlayOpacity: typeof overlayOpacity === 'number' ? overlayOpacity : (typeof overlayOpacity === 'string' ? parseFloat(overlayOpacity) : 0.5),
        styleType: styleType || "card",
        order: typeof order === 'number' ? order : (typeof order === 'string' ? parseInt(order) : 0),
        icon: icon || null,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json(sector);
  } catch (error) {
    console.error('Error creating sector:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create sector', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
