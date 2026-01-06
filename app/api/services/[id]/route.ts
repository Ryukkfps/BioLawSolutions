import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@/auth';

// PUT - Update service (admin only)
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

    // Update service
    await pool.query(
      `UPDATE Service SET 
       title = ?, subtitle = ?, description = ?, detailedDescription = ?, backgroundImage = ?, 
       ctaText = ?, ctaLink = ?, textColor = ?, overlayOpacity = ?, styleType = ?,
       \`order\` = ?, icon = ?, isActive = ?, updatedAt = NOW() 
       WHERE id = ?`,
      [
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
        isActive !== undefined ? isActive : true,
        serviceId
      ]
    );

    // Fetch the updated service
    const [rows] = await pool.query('SELECT * FROM Service WHERE id = ?', [serviceId]);
    const service = (rows as any[])[0];

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE - Delete service (admin only)
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

    // Check if service exists
    const [rows] = await pool.query('SELECT * FROM Service WHERE id = ?', [serviceId]);
    const service = (rows as any[])[0];

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Delete the service
    await pool.query('DELETE FROM Service WHERE id = ?', [serviceId]);

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}