'use client';

import { createContext, useContext } from 'react';
import { useNotifications } from '@/hooks/use-notifications';
import type { UseNotificationsReturn } from '@/hooks/use-notifications';

const NotificationsContext = createContext<UseNotificationsReturn | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const value = useNotifications();
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext(): UseNotificationsReturn {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotificationsContext must be used within NotificationsProvider');
  return ctx;
}
