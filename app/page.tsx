import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth/session';

export default async function RootPage() {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect('/dashboard');
  }

  redirect('/login');
}
