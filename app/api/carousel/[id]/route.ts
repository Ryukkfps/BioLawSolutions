import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, subtitle, description, image, ctaText, order, isActive } = body;
    
    const [result] = await pool.query(
      'UPDATE CarouselSlide SET title = ?, subtitle = ?, description = ?, image = ?, ctaText = ?, `order` = ?, isActive = ?, updatedAt = NOW() WHERE id = ?',
      [title, subtitle, description, image, ctaText, order, isActive, id]
    );
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const [result] = await pool.query(
      'DELETE FROM CarouselSlide WHERE id = ?',
      [id]
    );
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}