import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const ALLOWED_FILENAME_PATTERN = /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/i;

const MIME_MAP: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Strict validation: reject any path traversal characters or unexpected formats
    if (!filename || !ALLOWED_FILENAME_PATTERN.test(filename)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const cleanFilename = path.basename(filename);
    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
    const filePath = path.resolve(uploadsDir, cleanFilename);

    // Path traversal check
    if (!filePath.startsWith(uploadsDir + path.sep)) {
      return new NextResponse('Access denied', { status: 403 });
    }

    const buffer = await readFile(filePath);
    const ext = path.extname(cleanFilename).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('File not found', { status: 404 });
  }
}
