import type { Metadata } from "next";
import { Anuphan } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/lib/i18n/routing';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { cookies } from 'next/headers';

const anuphan = Anuphan({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-anuphan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Science@KMITL",
  description: "คณะวิทยาศาสตร์ สจล.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'en' | 'th')) {
    notFound();
  }

  // Providing all messages to the client
  const messages = await getMessages();

  // Get user info from cookies
  const cookieStore = await cookies();
  const userInfoCookie = cookieStore.get('user_info');
  
  let userInfo = undefined;
  if (userInfoCookie) {
    try {
      const { profile } = JSON.parse(userInfoCookie.value);
      userInfo = {
        name: `${profile?.data.firstname_en || 'User'} ${profile?.data.lastname_en || ''}`.trim(),
        role: profile?.data.position_en || 'Faculty member',
        avatar: profile?.data.avatar_url,
      };
    } catch (e) {
      // Ignore parsing errors
    }
  }

  return (
    <html lang={locale}>
      <body className={`${anuphan.variable} antialiased font-sans`}>
        <NextIntlClientProvider messages={messages}>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 w-full min-h-screen bg-[#F9F4EE]">
              <AppHeader userInfo={userInfo} />
              <div className="p-3">
                {children}
              </div>
            </main>
          </SidebarProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
