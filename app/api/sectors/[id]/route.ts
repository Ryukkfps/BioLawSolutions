import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sector = await prisma.sector.findUnique({
      where: { id }
    });

    if (!sector) {
      return NextResponse.json(
        { error: 'Sector not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(sector);
  } catch (error) {
    console.error('Error fetching sector:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sector' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
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

    const sector = await prisma.sector.update({
      where: { id },
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
    console.error('Error updating sector:', error);
    return NextResponse.json(
      { error: 'Failed to update sector' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await prisma.sector.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Sector deleted successfully' });
  } catch (error) {
    console.error('Error deleting sector:', error);
    return NextResponse.json(
      { error: 'Failed to delete sector' },
      { status: 500 }
    );
  }
}
