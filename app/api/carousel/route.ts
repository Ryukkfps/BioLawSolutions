import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const slides = await prisma.carouselSlide.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(slides);
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
    
    const slide = await prisma.carouselSlide.create({
      data: {
        title,
        subtitle,
        description,
        image,
        ctaText,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    
    return NextResponse.json({ success: true, id: slide.id, result: slide });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}
