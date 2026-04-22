import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

export const metadata: Metadata = {
  title: "Science@KMITL",
  description: "คณะวิทยาศาสตร์ สจล.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        {/* Sync dark class before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=document.documentElement;if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches)){d.classList.add('dark')}else{d.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased font-sans">
        <ToastProvider />
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
