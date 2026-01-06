import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Enquiry ORDER BY createdAt DESC'
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
    const { name, email, subject, message } = body;
    
    const enquiryId = `enquiry_${Date.now()}`;
    
    const [result] = await pool.query(
      'INSERT INTO Enquiry (id, name, email, subject, message, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [enquiryId, name, email, subject, message, 'PENDING']
    );
    
    return NextResponse.json({ success: true, id: enquiryId, result });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}