import { useState, useEffect } from 'react';
import { EditableConfig } from '@/lib/siteConfig';
import { subscribeSiteSettings } from '@/lib/dbService';
import { useInitialSiteConfig } from '@/components/SiteConfigProvider';

/**
 * Universal hook for subscribing to published site configuration directly from Firestore.
 * Initializes with server-rendered initialConfig to eliminate default content flicker,
 * then maintains a realtime subscription to Firestore cloud settings.
 */
export function useCustomConfig(): [EditableConfig, React.Dispatch<React.SetStateAction<EditableConfig>>] {
  const initialConfig = useInitialSiteConfig();
  const [config, setConfig] = useState<EditableConfig>(initialConfig);

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
