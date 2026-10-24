import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Target directory: public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Determine safe extension
    const extMatch = file.name.match(/\.[a-zA-Z0-9]+$/);
    const rawExt = extMatch ? extMatch[0].toLowerCase() : '.jpg';
    const allowedExts = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico'];
    const safeExt = allowedExts.includes(rawExt) ? rawExt : '.jpg';

    // Unique safe filename
    const cleanBase = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const uniqueFileName = `${cleanBase || 'asset'}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${safeExt}`;
    const destinationPath = path.join(uploadsDir, uniqueFileName);

    await writeFile(destinationPath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    const sizeKB = `${(file.size / 1024).toFixed(1)} KB`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFileName,
      originalName: file.name,
      size: sizeKB,
    });
  } catch (error: any) {
    console.error('API upload error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to upload image' }, { status: 500 });
  }
}
