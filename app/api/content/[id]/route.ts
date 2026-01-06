import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@/auth';

// PUT - Update content section (admin only)
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
    const contentId = params.id;

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

    // Update content section
    await pool.query(
      `UPDATE Content SET 
       title = ?, subtitle = ?, description = ?, backgroundImage = ?, 
       ctaText = ?, ctaLink = ?, textColor = ?, overlayOpacity = ?, 
       \`order\` = ?, isActive = ?, updatedAt = NOW() 
       WHERE id = ?`,
      [
        title,
        subtitle || null,
        description,
        backgroundImage,
        ctaText || null,
        ctaLink || null,
        textColor || 'white',
        overlayOpacity || 0.5,
        order || 0,
        isActive !== undefined ? isActive : true,
        contentId
      ]
    );

    // Fetch the updated content
    const [rows] = await pool.query('SELECT * FROM Content WHERE id = ?', [contentId]);
    const content = (rows as any[])[0];

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

// DELETE - Delete content section (admin only)
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
    const contentId = params.id;

    // Check if content exists
    const [rows] = await pool.query('SELECT * FROM Content WHERE id = ?', [contentId]);
    const content = (rows as any[])[0];

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Delete the content
    await pool.query('DELETE FROM Content WHERE id = ?', [contentId]);

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}