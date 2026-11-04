import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { put } from '@vercel/blob';
import { verifyAdminRequest } from '@/lib/serverAuth';

export const runtime = 'nodejs';

// Enforce max 4MB image upload (under Vercel 4.5MB request body limit)
const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

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

/**
 * Auto-detect Vercel Blob token from environment.
 * Vercel sometimes names the token after the store (e.g. TECH_BOKRA_MEDIA_READ_WRITE_TOKEN).
 */
function getBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return process.env.BLOB_READ_WRITE_TOKEN;
  }
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value === 'string') {
      if (value.startsWith('vercel_blob_rw_')) {
        return value;
      }
      if (key.endsWith('_READ_WRITE_TOKEN') || (key.includes('BLOB') && key.includes('TOKEN'))) {
        return value;
      }
    }
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Server-Side Authentication Guard (Session Cookie or Bearer Token)
    const auth = await verifyAdminRequest(req);
    if (!auth.valid || !auth.user) {
      return NextResponse.json(
        { error: 'انتهت جلسة الإدارة، سجّل الدخول مجدداً' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'لم يتم إرسال أي ملف في الطلب.' }, { status: 400 });
    }

    // 2. Strict File Size Limit (4MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `حجم الملف يتجاوز الحد الأقصى 4MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).` },
        { status: 400 }
      );
    }

    // 3. Strict MIME Type Validation
    const clientMime = (file.type || '').toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(clientMime)) {
      return NextResponse.json(
        { error: 'الصيغ المدعومة: JPG وPNG وWebP.' },
        { status: 400 }
      );
    }

    // 4. File Extension Validation
    const extMatch = file.name.match(/\.[a-zA-Z0-9]+$/);
    const rawExt = extMatch ? extMatch[0].toLowerCase() : '';
    if (!ALLOWED_EXTENSIONS.has(rawExt)) {
      return NextResponse.json(
        { error: 'امتداد الملف غير صالح. الامتدادات المصرح بها: .jpg, .jpeg, .png, .webp' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5. Binary Magic Bytes Validation (Prevents disguised polyglots / SVG XSS)
    const magicCheck = validateImageMagicBytes(buffer);
    if (!magicCheck.valid) {
      return NextResponse.json(
        { error: 'محتوى الملف لا يتطابق مع صورة حقيقية مدعومة (JPEG أو PNG أو WebP).' },
        { status: 400 }
      );
    }

    // 6. Safe Randomized UUID Filename
    const safeExt = rawExt === '.jpeg' ? '.jpg' : rawExt;
    const randomUuid = crypto.randomUUID();
    const uniqueFileName = `${randomUuid}${safeExt}`;

    let imageUrl = '';
    const blobToken = getBlobToken();

    // 7. Upload to Vercel Blob if token is found (under any custom or standard name)
    if (blobToken) {
      try {
        const blob = await put(`uploads/${uniqueFileName}`, buffer, {
          access: 'public',
          token: blobToken,
          contentType: clientMime,
          addRandomSuffix: false,
        });
        imageUrl = blob.url;
      } catch (blobErr: any) {
        console.warn('Vercel Blob upload warning, attempting filesystem fallback:', blobErr);
      }
    }

    // 8. Resilient Fallbacks if Vercel Blob is not yet linked:
    if (!imageUrl) {
      // 8a. Local filesystem fallback (writes to public/uploads)
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });
        await fs.writeFile(path.join(uploadsDir, uniqueFileName), buffer);
        imageUrl = `/uploads/${uniqueFileName}`;
      } catch (fsErr: any) {
        console.warn('Local filesystem write failed, using WebP base64 fallback:', fsErr);
        // 8b. Data URL fallback so the user is never blocked under any circumstances
        const base64 = buffer.toString('base64');
        imageUrl = `data:${clientMime};base64,${base64}`;
      }
    }

    const sizeKB = `${(file.size / 1024).toFixed(1)} KB`;

    console.info(`[ADMIN UPLOAD] Image ${uniqueFileName} stored by ${auth.user.email}: ${imageUrl.startsWith('data:') ? 'base64 data url' : imageUrl}`);

    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename: uniqueFileName,
      size: sizeKB,
      uploadedBy: auth.user.email,
    });
  } catch (error: any) {
    console.error('API upload error:', error);
    return NextResponse.json({ error: error?.message || 'تعذر إتمام رفع الملف.' }, { status: 500 });
  }
}
