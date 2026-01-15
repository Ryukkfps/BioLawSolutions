import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM AboutSection ORDER BY `order` ASC'
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
    const { title, subtitle, content, image, layout, order, isActive } = body;
    
    const id = `about_${Date.now()}`;
    
    const [result] = await pool.query(
      'INSERT INTO AboutSection (id, title, subtitle, content, image, layout, `order`, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [id, title, subtitle, content, image, layout || 'NORMAL', order || 0, isActive !== undefined ? isActive : true]
    );
    
    return NextResponse.json({ success: true, id, result });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}
