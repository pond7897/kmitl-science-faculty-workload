'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';
import { usePathname, useRouter } from 'next/navigation';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface AppHeaderProps {
  userInfo?: {
    name: string;
    role: string;
    avatar?: string;
    position?: string;
  };
}

export function AppHeader({ userInfo }: AppHeaderProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/sign-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Server will redirect to / after successful sign out
      // Just wait for the redirect
      if (res.ok) {
        window.location.href = res.url || '/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const breadcrumbMap: Record<string, string> = {
    '/dashboard': t('Sidebar.dashboard'),
    '/workload/form': t('Sidebar.workloadForm'),
    '/workload/history': t('Sidebar.workloadHistory'),
    '/profile': t('Sidebar.profile'),
  };

  const breadcrumb =
    Object.entries(breadcrumbMap).find(
      ([key]) => pathname === key || pathname.startsWith(key + '/')
    )?.[1] ?? '';

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-[#F27F0D] dark:bg-[#252220] px-4 py-3 shadow-md dark:border-b dark:border-[#4a4441]">
      {/* Left: Sidebar trigger + breadcrumb */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-white dark:text-[#e8e0d8] hover:bg-orange-600 dark:hover:bg-[#3d3533] rounded-lg" />
        {breadcrumb && (
          <span className="text-white/90 dark:text-[#e8e0d8] text-sm font-medium hidden sm:block">
            {breadcrumb}
          </span>
        )}
      </div>

      {/* Right: Utilities + User Info */}
      <div className="flex items-center gap-2">
        <div className="[&_button]:text-white dark:[&_button]:text-[#e8e0d8] [&_button:hover]:bg-orange-600 dark:[&_button:hover]:bg-[#3d3533] [&_svg]:stroke-white dark:[&_svg]:stroke-[#e8e0d8]">
          <LanguageSwitcher />
        </div>
        <div className="[&_button]:text-white dark:[&_button]:text-[#e8e0d8] [&_button:hover]:bg-orange-600 dark:[&_button:hover]:bg-[#3d3533] [&_svg]:stroke-white dark:[&_svg]:stroke-[#e8e0d8]">
          <ThemeSwitcher />
        </div>

        {userInfo && (
          <>
            <div className="w-px h-6 bg-white/30 dark:bg-[#4a4441] mx-1" />
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-white dark:text-[#e8e0d8] hover:bg-orange-600 dark:hover:bg-[#3d3533] rounded-lg p-2 transition-colors disabled:opacity-50"
                title={t('Sidebar.logout') || 'Logout'}
              >
                <LogOut size={18} />
              </button>
              <div className="text-right hidden sm:block">
                <p className="text-white dark:text-[#e8e0d8] font-semibold text-sm leading-tight">
                  {userInfo.name}
                </p>
                <p className="text-white/80 dark:text-[#8b7f77] text-xs">{userInfo.role}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-white dark:bg-[#3d3533] overflow-hidden flex items-center justify-center shrink-0">
                {userInfo.avatar ? (
                  <Image
                    src={userInfo.avatar}
                    alt={userInfo.name}
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-[#F27F0D] dark:text-[#C96442] font-bold text-base">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
