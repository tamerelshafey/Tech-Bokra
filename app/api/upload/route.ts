import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { verifyAdminRequest } from '@/lib/serverAuth';

export const runtime = 'nodejs';

// Enforce max 5MB image upload
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

// Allowed MIME types and extensions strictly restricted to image types
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

/**
 * Validate image binary magic bytes to prevent renamed executables or disguised scripts.
 */
function validateImageMagicBytes(buffer: Buffer): { valid: boolean; detectedExt?: string } {
  if (buffer.length < 12) {
    return { valid: false };
  }

  // JPEG magic bytes: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, detectedExt: '.jpg' };
  }

  // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, detectedExt: '.png' };
  }

  // WebP magic bytes: RIFF....WEBP (RIFF at 0, WEBP at 8)
  const riff = buffer.toString('ascii', 0, 4);
  const webp = buffer.toString('ascii', 8, 12);
  if (riff === 'RIFF' && webp === 'WEBP') {
    return { valid: true, detectedExt: '.webp' };
  }

  return { valid: false };
}

export async function POST(req: NextRequest) {
  try {
    // 1. Server-Side Authentication Guard (Session Cookie or Bearer Token)
    const auth = verifyAdminRequest(req);
    if (!auth.valid || !auth.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Administrative authentication session required.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided in request.' }, { status: 400 });
    }

    // 2. Strict File Size Limit (5MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File size exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB provided).` },
        { status: 400 }
      );
    }

    // 3. Strict MIME Type Validation
    const clientMime = (file.type || '').toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(clientMime)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP images are permitted.' },
        { status: 400 }
      );
    }

    // 4. File Extension Validation
    const extMatch = file.name.match(/\.[a-zA-Z0-9]+$/);
    const rawExt = extMatch ? extMatch[0].toLowerCase() : '';
    if (!ALLOWED_EXTENSIONS.has(rawExt)) {
      return NextResponse.json(
        { error: 'Invalid file extension. Permitted extensions: .jpg, .jpeg, .png, .webp' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5. Binary Magic Bytes Validation (Prevents disguised polyglots / SVG XSS)
    const magicCheck = validateImageMagicBytes(buffer);
    if (!magicCheck.valid) {
      return NextResponse.json(
        { error: 'File contents do not match a valid binary image format (JPEG, PNG, or WebP).' },
        { status: 400 }
      );
    }

    // Target directory: public/uploads
    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // 6. Safe Randomized UUID Filename (Never trust user-supplied filenames; prevents path traversal)
    const safeExt = rawExt === '.jpeg' ? '.jpg' : rawExt;
    const randomUuid = crypto.randomUUID();
    const uniqueFileName = `${randomUuid}${safeExt}`;

    // Verify absolute destination path is strictly inside uploadsDir
    const destinationPath = path.resolve(uploadsDir, uniqueFileName);
    if (!destinationPath.startsWith(uploadsDir + path.sep)) {
      return NextResponse.json({ error: 'Illegal path traversal attempt detected.' }, { status: 400 });
    }

    // 7. Persist to filesystem
    await writeFile(destinationPath, buffer);

    const publicUrl = `/api/uploads/${uniqueFileName}`;
    const sizeKB = `${(file.size / 1024).toFixed(1)} KB`;

    console.info(`[ADMIN UPLOAD] Image ${uniqueFileName} uploaded by ${auth.user.email}`);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFileName,
      size: sizeKB,
      uploadedBy: auth.user.email,
    });
  } catch (error: any) {
    console.error('API upload error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to process file upload.' }, { status: 500 });
  }
}
