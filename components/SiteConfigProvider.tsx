'use client';

import React, { createContext, useContext } from 'react';
import { EditableConfig, defaultEditableConfig } from '@/lib/siteConfig';

const SiteConfigContext = createContext<EditableConfig>(defaultEditableConfig);

export function SiteConfigProvider({
  initialConfig,
  children,
}: {
  initialConfig: EditableConfig;
  children: React.ReactNode;
}) {
  return (
    <SiteConfigContext.Provider value={initialConfig || defaultEditableConfig}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useInitialSiteConfig(): EditableConfig {
  return useContext(SiteConfigContext) || defaultEditableConfig;
}
