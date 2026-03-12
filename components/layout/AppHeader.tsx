'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/lib/i18n/routing';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import Image from 'next/image';

interface AppHeaderProps {
  userInfo?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export function AppHeader({ userInfo }: AppHeaderProps) {
  const t = useTranslations('Sidebar');
  const pathname = usePathname();

  // Derive breadcrumb label from current route
  const breadcrumbMap: Record<string, string> = {
    '/dashboard': t('dashboard'),
    '/workload/form': t('workloadForm'),
    '/workload/history': t('workloadHistory'),
    '/profile': t('profile'),
  };

  const breadcrumb =
    Object.entries(breadcrumbMap).find(
      ([key]) => pathname === key || pathname.startsWith(key + '/')
    )?.[1] ?? '';

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-[#F27F0D] px-4 py-3 shadow-md">
      {/* Left: Sidebar trigger + breadcrumb */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-white hover:bg-orange-600 rounded-lg" />
        {breadcrumb && (
          <span className="text-white/90 text-sm font-medium hidden sm:block">
            {breadcrumb}
          </span>
        )}
      </div>

      {/* Right: Utilities + User Info */}
      <div className="flex items-center gap-2">
        <div className="[&_button]:text-white [&_button:hover]:bg-orange-600 [&_svg]:stroke-white">
          <LanguageSwitcher />
        </div>
        <div className="[&_button]:text-white [&_button:hover]:bg-orange-600 [&_svg]:stroke-white">
          <ThemeSwitcher />
        </div>

        {userInfo && (
          <>
            <div className="w-px h-6 bg-white/30 mx-1" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-white font-semibold text-sm leading-tight">
                  {userInfo.name}
                </p>
                <p className="text-white/80 text-xs">{userInfo.role}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-white overflow-hidden flex items-center justify-center shrink-0">
                {userInfo.avatar ? (
                  <Image
                    src={userInfo.avatar}
                    alt={userInfo.name}
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-[#F27F0D] font-bold text-base">
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
