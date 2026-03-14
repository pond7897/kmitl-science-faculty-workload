import { redirect } from 'next/navigation';
import { getAuthSession, getAppUser } from '@/lib/auth/session';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { NotificationsProvider } from '@/components/providers/NotificationsProvider';

type Props = {
  children: React.ReactNode;
};

export default async function ProtectedLayout({ children }: Props) {
  const session = await getAuthSession();

  if (!session) {
    redirect('/api/auth/login');
  }

  const user = await getAppUser();

  return (
    <SidebarProvider>
      <NotificationsProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F9F4EE] dark:bg-[#1a1a1a]">
          <AppHeader userInfo={user ?? undefined} />
          <main className="flex-1 p-3 sm:p-4">
            {children}
          </main>
        </div>
      </NotificationsProvider>
    </SidebarProvider>
  );
}
