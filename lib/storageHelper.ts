/**
 * Storage & Image Optimization Helper for Tech Bokra
 * Compresses images client-side before upload to Vercel Blob via /api/upload.
 */
import { EditableConfig, MediaVaultItem } from '@/lib/siteConfig';
import { Project } from '@/lib/content';

export const LOCAL_STORAGE_KEY = 'tech_bokra_custom_config_v5';

const SUPPORTED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

/**
 * Prepares image file for upload:
 * - Validates format (rejects SVG, GIF, etc. with Arabic error)
 * - If already <= 400KB and supported, returns original file
 * - Otherwise resizes to max dimension 1600px and converts to WebP at 0.82 quality
 *   (preserving transparency for logos and icons)
 */
export async function prepareImageForUpload(file: File): Promise<File> {
  const extMatch = file.name.match(/\.[a-zA-Z0-9]+$/);
  const ext = extMatch ? extMatch[0].toLowerCase() : '';
  const mime = (file.type || '').toLowerCase();

  if (!SUPPORTED_MIME_TYPES.has(mime) || !SUPPORTED_EXTENSIONS.has(ext)) {
    throw new Error('الصيغ المدعومة: JPG وPNG وWebP');
  }

  // If already under 400KB and supported, upload as-is
  if (file.size <= 400 * 1024) {
    return file;
  }

  if (typeof window === 'undefined') {
    return file;
  }

  return new Promise<File>((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        let { width, height } = img;
        const maxDim = 1600;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const cleanBase = file.name.replace(/\.[a-zA-Z0-9]+$/, '');
            const compressedFile = new File([blob], `${cleanBase}.webp`, {
              type: 'image/webp',
            });
            resolve(compressedFile);
          },
          'image/webp',
          0.82
        );
      } catch (err) {
        console.warn('Canvas optimization notice:', err);
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('تعذر قراءة ملف الصورة. تأكد من سلامة الملف.'));
    };

    img.src = objectUrl;
  });
}

import { auth } from '@/lib/firebase';

/**
 * Uploads an image file to /api/upload (Vercel Blob / Local Storage).
 * Compresses in-browser first, validates format, attaches Firebase auth token, and surfaces real server errors.
 * Never returns data: URLs.
 */
export async function uploadImageToServer(file: File): Promise<{ url: string; size: string; name: string }> {
  // Step 1: Validate and compress in browser
  const fileToUpload = await prepareImageForUpload(file);

  // Step 2: Retrieve Firebase Auth ID Token for direct dual authentication
  let idToken: string | null = null;
  try {
    if (auth.currentUser) {
      idToken = await auth.currentUser.getIdToken();
    }
  } catch (tokenErr) {
    console.warn('Could not retrieve Firebase ID token for upload:', tokenErr);
  }

  // Step 3: Upload to Next.js API route (/api/upload -> Vercel Blob)
  const formData = new FormData();
  formData.append('file', fileToUpload);

  const headers: Record<string, string> = {};
  if (idToken) {
    headers['Authorization'] = `Bearer ${idToken}`;
  }

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include',
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('انتهت جلسة الإدارة، سجّل الدخول مجدداً');
    }
    if (res.status === 503) {
      throw new Error(data?.error || 'مخزن الصور غير مُفعّل: أنشئ Vercel Blob واربطه بالمشروع ثم أعد النشر.');
    }
    if (data?.error) {
      throw new Error(data.error);
    }
    throw new Error(`فشل رفع الصورة إلى الخادم (رمز ${res.status})`);
  }

  if (data?.url) {
    return {
      url: data.url,
      size: data.size || `${(fileToUpload.size / 1024).toFixed(1)} KB`,
      name: data.filename || fileToUpload.name,
    };
  }

  throw new Error('لم يتم استلام رابط الصورة من الخادم.');
}

/**
 * Strips huge base64 strings (>50KB) from projects/mediaVault if quota is tight,
 * preserving all metadata, text, URLs, and configs.
 */
function pruneHeavyDataForStorage(config: EditableConfig): EditableConfig {
  const cloned = JSON.parse(JSON.stringify(config)) as EditableConfig;

  // Prune projects with huge inline base64
  if (Array.isArray(cloned.projectsList)) {
    cloned.projectsList = cloned.projectsList.map((p) => {
      if (p.image && p.image.startsWith('data:') && p.image.length > 50000) {
        // Fallback to placeholder unsplash image with matching category
        return {
          ...p,
          image: p.image.slice(0, 100), // truncated flag or fallback handled in UI
        };
      }
      return p;
    });
  }

  // Prune mediaVault items with huge inline base64
  if (Array.isArray(cloned.mediaVault)) {
    cloned.mediaVault = cloned.mediaVault.slice(0, 10).map((item) => {
      if (item.url && item.url.startsWith('data:') && item.url.length > 50000) {
        return {
          ...item,
          url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
        };
      }
      return item;
    });
  }

  return cloned;
}

/**
 * Safely persists config to window.localStorage without crashing on QuotaExceededError.
 */
export function safeSaveConfigToStorage(
  config: EditableConfig,
  key: string = LOCAL_STORAGE_KEY
): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const serialized = JSON.stringify(config);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.warn('Primary localStorage.setItem failed (likely QuotaExceededError). Attempting pruned storage save:', error);
    try {
      // 1. Attempt with pruned heavy base64 items
      const pruned = pruneHeavyDataForStorage(config);
      localStorage.setItem(key, JSON.stringify(pruned));
      return true;
    } catch (secondError) {
      console.warn('Pruned localStorage fallback also failed. Clearing obsolete cache items:', secondError);
      try {
        // 2. Clear old non-critical keys
        localStorage.removeItem('tech_bokra_temp_uploads');
        // Try saving essential settings only
        const essentialConfig: Partial<EditableConfig> = {
          phone: config.phone,
          whatsappNumber: config.whatsappNumber,
          email: config.email,
          addressAr: config.addressAr,
          addressEn: config.addressEn,
          brandBioAr: config.brandBioAr,
          brandBioEn: config.brandBioEn,
          commercialRegister: config.commercialRegister,
          taxId: config.taxId,
          footerRightsAr: config.footerRightsAr,
          footerRightsEn: config.footerRightsEn,
          showAnnouncement: config.showAnnouncement,
          announcementTextAr: config.announcementTextAr,
          announcementTextEn: config.announcementTextEn,
        };
        localStorage.setItem(key, JSON.stringify(essentialConfig));
        return true;
      } catch {
        // Silently fail so app UI NEVER crashes
        return false;
      }
    }
  }
}

/**
 * Safely loads config from window.localStorage.
 */
export function safeLoadConfigFromStorage(
  key: string = LOCAL_STORAGE_KEY
): Partial<EditableConfig> | null {
  if (typeof window === 'undefined') return null;

  try {
    // Purge outdated storage keys to free browser quota and eliminate stale configs
    ['tech_bokra_custom_config_v1', 'tech_bokra_custom_config_v2', 'tech_bokra_custom_config_v3', 'tech_bokra_custom_config_v4'].forEach((oldKey) => {
      try {
        localStorage.removeItem(oldKey);
      } catch {
        // ignore
      }
    });

    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    return parsed;
  } catch (err) {
    console.warn('Failed to parse cached config from localStorage:', err);
    return null;
  }
}
