'use client';

import { usePathname } from 'next/navigation';
import { AppLayout } from './AppLayout';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  if (isLanding) {
    return <>{children}</>;
  }

  return <AppLayout>{children}</AppLayout>;
}
