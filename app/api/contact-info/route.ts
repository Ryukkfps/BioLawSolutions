import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const contactInfo = await prisma.contactInfo.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
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

    const { address, phone, email, workingHours } = await request.json();

    if (!address || !phone || !email) {
      return NextResponse.json(
        { error: 'Address, phone, and email are required' },
        { status: 400 }
      );
    }

    await prisma.contactInfo.deleteMany();

    const contactInfo = await prisma.contactInfo.create({
      data: {
        address,
        phone,
        email,
        workingHours: workingHours || null
      }
    });

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error creating contact info:', error);
    return NextResponse.json(
      { error: 'Failed to create contact info' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { address, phone, email, workingHours } = await request.json();

    if (!address || !phone || !email) {
      return NextResponse.json(
        { error: 'Address, phone, and email are required' },
        { status: 400 }
      );
    }

    const existingContactInfo = await prisma.contactInfo.findFirst();

    if (!existingContactInfo) {
      return NextResponse.json(
        { error: 'No contact info found to update' },
        { status: 404 }
      );
    }

    const contactInfo = await prisma.contactInfo.update({
      where: { id: existingContactInfo.id },
      data: {
        address,
        phone,
        email,
        workingHours: workingHours || null,
      }
    });

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json(
      { error: 'Failed to update contact info' },
      { status: 500 }
    );
  }
}
