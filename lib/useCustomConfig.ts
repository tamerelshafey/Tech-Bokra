import { useState, useEffect } from 'react';
import { EditableConfig, defaultEditableConfig } from '@/lib/siteConfig';
import { subscribeSiteSettings } from '@/lib/dbService';

/**
 * Universal hook for subscribing to published site configuration directly from Firestore.
 * Firestore is the authoritative Single Source of Truth. No stale localStorage caching.
 */
export function useCustomConfig(): [EditableConfig, React.Dispatch<React.SetStateAction<EditableConfig>>] {
  const [config, setConfig] = useState<EditableConfig>(defaultEditableConfig);

  useEffect(() => {
    // Realtime listener to Firestore cloud settings
    let unsubscribe = () => {};
    try {
      unsubscribe = subscribeSiteSettings((cloudConfig) => {
        if (cloudConfig) {
          setConfig(cloudConfig);
        }
      });
    } catch (err) {
      console.warn('subscribeSiteSettings notice:', err);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  return [config, setConfig];
}
