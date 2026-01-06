import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@/auth';

// GET - Fetch services (public endpoint for active services, admin endpoint for all services)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminView = searchParams.get('admin') === 'true';
    
    let query = 'SELECT * FROM Service';
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
      // Show all services for admin
      query += ' ORDER BY `order` ASC, createdAt DESC';
    } else {
      // Public view - only active services
      query += ' WHERE isActive = ? ORDER BY `order` ASC';
      params = [true];
    }

    const [rows] = await pool.query(query, params);
    const services = rows as any[];

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST - Create new service (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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
    } = await request.json();

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Create new service
    const serviceId = `service_${Date.now()}`;
    await pool.query(
      `INSERT INTO Service (id, title, subtitle, description, detailedDescription, backgroundImage, ctaText, ctaLink, textColor, overlayOpacity, styleType, \`order\`, icon, isActive, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        serviceId,
        title,
        subtitle || null,
        description,
        detailedDescription || null,
        backgroundImage || null,
        ctaText || null,
        ctaLink || null,
        textColor || 'white',
        overlayOpacity || 0.5,
        styleType || 'card',
        order || 0,
        icon || null,
        isActive !== undefined ? isActive : true
      ]
    );

    // Fetch the created service
    const [rows] = await pool.query('SELECT * FROM Service WHERE id = ?', [serviceId]);
    const service = (rows as any[])[0];

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}