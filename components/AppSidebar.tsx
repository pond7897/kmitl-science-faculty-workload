'use client';

import { usePathname } from '@/lib/i18n/routing';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('Sidebar');
  const { state } = useSidebar();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-orange-100">
      {/* Logo Header */}
      <SidebarHeader className="bg-[#F27F0D] p-2 m-2 gap-2 rounded-lg h-16">
        <div className="flex items-center justify-center w-full h-full">
          <Image
            src={isCollapsed ? 'https://www.eng.kmitl.ac.th/storage/2024/06/About-4-B.png' : 'https://iam.science.kmitl.ac.th/_app/immutable/assets/sci-kmitl-logo.64kyxinc.avif'}
            alt="School of Science KMITL"
            width={isCollapsed ? 40 : 180}
            height={isCollapsed ? 40 : 50}
            // className="object-contain"
            unoptimized
            priority
          />
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={t(item.key)}
                  className={`
                    h-11 rounded-xl
                    data-[active=true]:bg-[#FEF2E7]!
                    data-[active=true]:text-[#F27F0D]!
                    data-[active=true]:font-semibold!
                    data-[active=true]:hover:bg-[#FEF2E7]!
                    data-[active=true]:hover:text-[#F27F0D]!
                    text-[#F27F0D]
                    hover:bg-[#FEF2E7]/50
                    hover:text-[#F27F0D]
                  `}
                >
                  <Link href={item.href} className="flex items-center gap-3 w-full">
                    <Icon
                      size={22}
                      strokeWidth={active ? 2.5 : 2}
                      className="shrink-0"
                    />
                    <span className="text-[15px]">{t(item.key)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Logout Button */}
      <SidebarFooter className="p-3 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={t('logout')}
              className="h-11 bg-[#F27F0D] text-white hover:bg-orange-600 hover:text-white rounded-xl font-semibold justify-center"
            >
              <a href="/api/auth/logout" className="flex items-center gap-2">
                <span className="text-[15px] group-data-[collapsible=icon]:hidden">
                  {t('logout')}
                </span>
                <LogOut size={20} />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
