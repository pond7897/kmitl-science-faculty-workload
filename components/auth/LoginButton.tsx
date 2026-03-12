"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

export default function LoginButton() {
  const { t } = useTranslation();

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  return (
    <Button
      onClick={handleLogin}
      className="w-full bg-orange-50 dark:bg-orange-900 hover:bg-orange-100 dark:hover:bg-orange-800 text-gray-900 dark:text-orange-50 border border-orange-200 dark:border-orange-700 h-10 px-4 py-2 text-sm font-medium rounded-md transition-colors"
      size="default"
    >
      <div className="flex items-center justify-center gap-2 w-full">
        <span>{t('LoginPage.signIn')}</span>
      </div>
    </Button>
  );
}
