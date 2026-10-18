'use client';

import { useState, useEffect } from 'react';
import { EditableConfig, defaultEditableConfig } from '@/components/AdminSettingsModal';
import { safeLoadConfigFromStorage } from '@/lib/storageHelper';
import { subscribeSiteSettings } from '@/lib/dbService';

/**
 * Universal hook for loading, hydrating and subscribing to site configuration.
 * Complies with React 19 / ESLint rules without cascading render warnings.
 */
export function useCustomConfig(): [EditableConfig, React.Dispatch<React.SetStateAction<EditableConfig>>] {
  const [config, setConfig] = useState<EditableConfig>(defaultEditableConfig);

  useEffect(() => {
    // 1. Safe delayed hydration from localStorage
    const timer = setTimeout(() => {
      const saved = safeLoadConfigFromStorage();
      if (saved) {
        setConfig((prev) => ({ ...prev, ...saved }));
      }
    }, 0);

    // 2. Realtime listener to Firestore cloud settings
    let unsubscribe = () => {};
    try {
      unsubscribe = subscribeSiteSettings((cloudConfig) => {
        if (cloudConfig) {
          setConfig((prev) => ({ ...prev, ...cloudConfig }));
        }
      });
    } catch (err) {
      console.warn('subscribeSiteSettings notice:', err);
    }

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  return [config, setConfig];
}
