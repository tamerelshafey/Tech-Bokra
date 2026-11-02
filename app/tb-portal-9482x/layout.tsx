import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tech Bokra - Admin Console Gate',
  description: 'Restricted administrative gateway for Tech Bokra internal operations.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
