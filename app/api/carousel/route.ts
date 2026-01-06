import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM CarouselSlide ORDER BY `order` ASC'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subtitle, description, image, ctaText, order, isActive } = body;
    
    const slideId = `slide_${Date.now()}`;
    
    const [result] = await pool.query(
      'INSERT INTO CarouselSlide (id, title, subtitle, description, image, ctaText, `order`, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [slideId, title, subtitle, description, image, ctaText, order, isActive]
    );
    
    return NextResponse.json({ success: true, id: slideId, result });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}