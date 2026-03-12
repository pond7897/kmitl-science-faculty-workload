import { isAuthenticated } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

export default async function AuthLayout({ children }: Props) {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#F9F4EE] dark:bg-[#1a1a1a] flex items-center justify-center">
      {children}
    </div>
  );
}
