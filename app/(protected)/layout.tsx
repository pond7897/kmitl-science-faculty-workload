import { redirect } from 'next/navigation';
import { getAuthSession, getAppUser } from '@/lib/auth/session';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';

type Props = {
  children: React.ReactNode;
};

export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({ children }: Props) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // for instance IAM 

  /* if (!session) {
    redirect('/api/auth/login');
  } */

  if (!session) {
    redirect('/login');
  }
  const user = await getAppUser();

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F9F4EE] dark:bg-[#1a1a1a]">
        <AppHeader userInfo={user ?? undefined} />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
