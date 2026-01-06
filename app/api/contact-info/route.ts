import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@/auth';

// GET - Fetch contact info (public endpoint)
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM ContactInfo ORDER BY updatedAt DESC LIMIT 1');
    const contactInfo = (rows as any[])[0] || null;

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    );
  }
}

// POST - Create new contact info (admin only)
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

    // Validate required fields
    if (!address || !phone || !email) {
      return NextResponse.json(
        { error: 'Address, phone, and email are required' },
        { status: 400 }
      );
    }

    // Delete existing contact info (we only want one record)
    await pool.query('DELETE FROM ContactInfo');

    // Create new contact info
    const [result] = await pool.query(
      'INSERT INTO ContactInfo (id, address, phone, email, workingHours, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [`contact_${Date.now()}`, address, phone, email, workingHours || null]
    );

    // Fetch the created record
    const [rows] = await pool.query('SELECT * FROM ContactInfo ORDER BY createdAt DESC LIMIT 1');
    const contactInfo = (rows as any[])[0];

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error creating contact info:', error);
    return NextResponse.json(
      { error: 'Failed to create contact info' },
      { status: 500 }
    );
  }
}

// PUT - Update contact info (admin only)
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

    // Validate required fields
    if (!address || !phone || !email) {
      return NextResponse.json(
        { error: 'Address, phone, and email are required' },
        { status: 400 }
      );
    }

    // Find existing contact info
    const [rows] = await pool.query('SELECT * FROM ContactInfo LIMIT 1');
    const existingContactInfo = (rows as any[])[0];

    if (!existingContactInfo) {
      return NextResponse.json(
        { error: 'No contact info found to update' },
        { status: 404 }
      );
    }

    // Update contact info
    await pool.query(
      'UPDATE ContactInfo SET address = ?, phone = ?, email = ?, workingHours = ?, updatedAt = NOW() WHERE id = ?',
      [address, phone, email, workingHours || null, existingContactInfo.id]
    );

    // Fetch the updated record
    const [updatedRows] = await pool.query('SELECT * FROM ContactInfo WHERE id = ?', [existingContactInfo.id]);
    const contactInfo = (updatedRows as any[])[0];

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json(
      { error: 'Failed to update contact info' },
      { status: 500 }
    );
  }
}