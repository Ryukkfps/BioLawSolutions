import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const filePath = pathSegments.join('/');
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const fullPath = path.join(uploadsDir, filePath);

    // Security: Prevent directory traversal
    if (!fullPath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 403 });
    }

    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = await readFile(fullPath);
    
    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };
    
    const contentType = contentTypes[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 });
  }
}
