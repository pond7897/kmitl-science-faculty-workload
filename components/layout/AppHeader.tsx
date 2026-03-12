'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
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
  const { t } = useTranslation();
  const pathname = usePathname();

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
    <header className="sticky top-0 z-50 flex items-center justify-between bg-[#F27F0D] dark:bg-sidebar px-4 py-3 shadow-md dark:border-b dark:border-sidebar-border">
      {/* Left: Sidebar trigger + breadcrumb */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-white dark:text-sidebar-foreground hover:bg-orange-600 dark:hover:bg-sidebar-accent rounded-lg" />
        {breadcrumb && (
          <span className="text-white/90 dark:text-sidebar-foreground text-sm font-medium hidden sm:block">
            {breadcrumb}
          </span>
        )}
      </div>

      {/* Right: Utilities + User Info */}
      <div className="flex items-center gap-2">
        <div className="[&_button]:text-white dark:[&_button]:text-sidebar-foreground [&_button:hover]:bg-orange-600 dark:[&_button:hover]:bg-sidebar-accent [&_svg]:stroke-white dark:[&_svg]:stroke-sidebar-foreground">
          <LanguageSwitcher />
        </div>
        <div className="[&_button]:text-white dark:[&_button]:text-sidebar-foreground [&_button:hover]:bg-orange-600 dark:[&_button:hover]:bg-sidebar-accent [&_svg]:stroke-white dark:[&_svg]:stroke-sidebar-foreground">
          <ThemeSwitcher />
        </div>

        {userInfo && (
          <>
            <div className="w-px h-6 bg-white/30 dark:bg-sidebar-border mx-1" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-white dark:text-sidebar-foreground font-semibold text-sm leading-tight">
                  {userInfo.name}
                </p>
                <p className="text-white/80 dark:text-muted-foreground text-xs">{userInfo.role}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-white dark:bg-sidebar-accent overflow-hidden flex items-center justify-center shrink-0">
                {userInfo.avatar ? (
                  <Image
                    src={userInfo.avatar}
                    alt={userInfo.name}
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-[#F27F0D] dark:text-primary font-bold text-base">
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
