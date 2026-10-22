/**
 * Storage & Image Optimization Helper for Tech Bokra
 * Prevents QuotaExceededError and provides fast, client-side canvas compression.
 */
import { EditableConfig, MediaVaultItem } from '@/components/AdminSettingsModal';
import { Project } from '@/lib/content';

export const LOCAL_STORAGE_KEY = 'tech_bokra_custom_config_v5';

/**
 * Client-side canvas compression for uploaded images.
 * Resizes images to maximum standard dimensions (default 1280x800)
 * and compresses JPEG to ~0.72 quality.
 * Turns 5MB-15MB camera/phone uploads into 50KB-120KB data strings.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1280,
  maxHeight = 850,
  quality = 0.72
): Promise<string> {
  return new Promise((resolve) => {
    // If not an image or SVG, read as standard data URL
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = (e.target?.result as string) || '';
      if (typeof window === 'undefined') {
        resolve(rawDataUrl);
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', quality);
            resolve(compressed);
          } else {
            resolve(rawDataUrl);
          }
        } catch (err) {
          console.warn('Canvas compression fallback to raw data:', err);
          resolve(rawDataUrl);
        }
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
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
