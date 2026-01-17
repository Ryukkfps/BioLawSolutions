import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

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

    const params = await context.params;
    const serviceId = params.id;

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

    // Ensure types are correct for Prisma
    const updateData = {
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
      isActive: isActive !== undefined ? isActive : true,
    };

    const service = await prisma.service.update({
      where: { id: serviceId },
      data: updateData
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to update service', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

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
    const serviceId = params.id;

    await prisma.service.delete({
      where: { id: serviceId }
    });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
