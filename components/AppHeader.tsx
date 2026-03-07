'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { ClipboardList } from 'lucide-react';
import Image from 'next/image';

interface AppHeaderProps {
  userInfo?: {
    name: string;
    role: string;
    avatar?: string;
  };
  breadcrumb?: string;
}

export function AppHeader({ userInfo, breadcrumb }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-[#F27F0D] px-4 py-3 shadow-md">
      {/* Left Section: Sidebar Trigger + Logo + Breadcrumb */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-white hover:bg-orange-600 rounded-lg" />
        
        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
          <ClipboardList className="w-5 h-5 text-white" />
          <span className="text-white font-medium text-sm">
            {breadcrumb || 'ประวัติการทำงาน > รายละเอียดข้อมูล'}
          </span>
        </div>
      </div>

      {/* Right Section: User Info */}
      {userInfo && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-white font-semibold text-sm">{userInfo.name}</p>
            <p className="text-white/90 text-xs">{userInfo.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center">
            {userInfo.avatar ? (
              <Image
                src={userInfo.avatar}
                alt={userInfo.name}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-lg">
                  {userInfo.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
