import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@/auth';

// GET - Fetch content sections (public endpoint for active content, admin endpoint for all content)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminView = searchParams.get('admin') === 'true';
    
    let query = 'SELECT * FROM Content';
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
      // Show all content for admin
      query += ' ORDER BY `order` ASC, createdAt DESC';
    } else {
      // Public view - only active content
      query += ' WHERE isActive = ? ORDER BY `order` ASC';
      params = [true];
    }

    const [rows] = await pool.query(query, params);
    const content = rows as any[];

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST - Create new content section (admin only)
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
      backgroundImage, 
      ctaText, 
      ctaLink, 
      textColor, 
      overlayOpacity, 
      order, 
      isActive 
    } = await request.json();

    // Validate required fields
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

    // Create new content section
    const contentId = `content_${Date.now()}`;
    await pool.query(
      `INSERT INTO Content (id, title, subtitle, description, backgroundImage, ctaText, ctaLink, textColor, overlayOpacity, \`order\`, isActive, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        contentId,
        title,
        subtitle || null,
        description,
        backgroundImage,
        ctaText || null,
        ctaLink || null,
        textColor || 'white',
        overlayOpacity || 0.5,
        order || 0,
        isActive !== undefined ? isActive : true
      ]
    );

    // Fetch the created content
    const [rows] = await pool.query('SELECT * FROM Content WHERE id = ?', [contentId]);
    const content = (rows as any[])[0];

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}