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
      const services = await prisma.service.findMany({
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' }
        ]
      });
      // Map to ensure default values for existing records
      const mappedServices = services.map(service => ({
        ...service,
        styleType: service.styleType || 'card',
        textColor: service.textColor || 'black',
        overlayOpacity: service.overlayOpacity ?? 0.5
      }));
      return NextResponse.json(mappedServices);
    } else {
      const services = await prisma.service.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      });
      // Map to ensure default values for existing records
      const mappedServices = services.map(service => ({
        ...service,
        styleType: service.styleType || 'card',
        textColor: service.textColor || 'black',
        overlayOpacity: service.overlayOpacity ?? 0.5
      }));
      return NextResponse.json(mappedServices);
    }
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
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

    const service = await prisma.service.create({
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

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { 
        error: 'Failed to create service', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
