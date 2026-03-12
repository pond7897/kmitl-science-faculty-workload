'use client';

import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import {
  LayoutDashboard,
  ClipboardPlus,
  ClipboardList,
  User,
  LogOut,
} from 'lucide-react';
import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'workloadForm', href: '/workload/form', icon: ClipboardPlus },
  { key: 'workloadHistory', href: '/workload/history', icon: ClipboardList },
  { key: 'profile', href: '/profile', icon: User },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { state } = useSidebar();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-orange-100/60 dark:border-sidebar-border shadow-[2px_0_12px_0_rgba(242,127,13,0.06)] dark:shadow-none"
    >
      {/* ── Logo Header ── */}
      <SidebarHeader className="p-3 pb-2">
        <div
          className={`
            relative flex items-center justify-center
            bg-[#F27F0D] dark:bg-sidebar-accent
            rounded-sm overflow-hidden shadow-sm shadow-orange-200/40 dark:shadow-none
            transition-all duration-300 ease-in-out
            ${isCollapsed ? 'w-11 h-11 mx-auto' : 'w-full h-12 px-4'}
          `}
        >
          <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent pointer-events-none" />
          {isCollapsed ? (
            <Image
              src="https://www.eng.kmitl.ac.th/storage/2024/06/About-4-B.png"
              alt="KMITL"
              width={30}
              height={30}
              className="object-contain relative z-10"
              unoptimized
              priority
            />
          ) : (
            <Image
              src="https://iam.science.kmitl.ac.th/_app/immutable/assets/sci-kmitl-logo.64kyxinc.avif"
              alt="School of Science KMITL"
              width={156}
              height={44}
              className="object-contain relative z-10"
              unoptimized
              priority
            />
          )}
        </div>
      </SidebarHeader>

      {/* ── thin divider ── */}
      <div className="mx-3 h-px bg-linear-to-r from-transparent via-orange-200/70 dark:via-sidebar-border to-transparent group-data-[collapsible=icon]:mx-2" />

      {/* ── Navigation ── */}
      <SidebarContent className="px-2 py-3">
        <SidebarMenu className="gap-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={t(`Sidebar.${item.key}`)}
                  className={`
                    relative h-11 rounded-md transition-all duration-200
                    text-[#C46A00] dark:text-sidebar-foreground
                    hover:bg-orange-50 hover:text-[#F27F0D] dark:hover:bg-sidebar-accent dark:hover:text-primary
                    data-[active=true]:bg-[#FEF2E7]! dark:data-[active=true]:bg-sidebar-accent!
                    data-[active=true]:from-[unset]!
                    data-[active=true]:to-[unset]!
                    data-[active=true]:text-[#F27F0D]! dark:data-[active=true]:text-primary!
                    data-[active=true]:font-semibold!
                    data-[active=true]:shadow-sm!
                    data-[active=true]:shadow-orange-100! dark:data-[active=true]:shadow-none!
                    data-[active=true]:hover:bg-[#FEF2E7]! dark:data-[active=true]:hover:bg-sidebar-accent!
                    data-[active=true]:hover:from-[unset]!
                    data-[active=true]:hover:to-[unset]!
                    group-data-[collapsible=icon]:size-11!
                    group-data-[collapsible=icon]:mx-auto!
                    group-data-[collapsible=icon]:p-0!
                    group-data-[collapsible=icon]:justify-center
                  `}
                >
                  <Link href={item.href} className="flex items-center gap-3 w-full px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
                    <Icon
                      size={19}
                      strokeWidth={active ? 2.5 : 1.8}
                      className="shrink-0"
                    />
                    <span className="text-[14.5px] tracking-wide group-data-[collapsible=icon]:hidden">
                      {t(`Sidebar.${item.key}`)}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* ── thin divider ── */}
      <div className="mx-3 h-px bg-linear-to-r from-transparent via-orange-200/70 dark:via-sidebar-border to-transparent group-data-[collapsible=icon]:mx-2" />

      {/* ── Logout Button ── */}
      <SidebarFooter className="p-3 pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={t('Sidebar.logout')}
              className={`
                h-11 rounded-sm font-semibold transition-all duration-200
                bg-[#F27F0D] dark:bg-primary
                text-white shadow-sm shadow-orange-200/40 dark:shadow-none
                hover:bg-[#E06C00] dark:hover:bg-primary/80
                hover:shadow-md hover:shadow-orange-200/40 dark:hover:shadow-none
                hover:text-white
                active:scale-[0.98]
                group-data-[collapsible=icon]:size-11!
                group-data-[collapsible=icon]:mx-auto!
                group-data-[collapsible=icon]:p-0!
                group-data-[collapsible=icon]:justify-center
                group-data-[collapsible=icon]:rounded-xl!
              `}
            >
              <Link
                href="/api/auth/logout"
                className="flex items-center justify-center gap-2"
              >
                <span className="text-[14.5px] tracking-wide group-data-[collapsible=icon]:hidden">
                  {t('Sidebar.logout')}
                </span>
                <LogOut size={18} className="shrink-0" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
