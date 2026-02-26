import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token');
  
  // If user is already logged in, redirect to dashboard
  if (accessToken) {
    redirect('/profile');
  }
  
  // Otherwise, redirect to login
  redirect('/api/auth/login');
}
