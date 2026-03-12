import LoginButton from '@/components/auth/LoginButton';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm mx-auto px-6">
      {/* Language switcher top-right */}
      <div className="flex justify-end mb-6">
        <LanguageSwitcher />
      </div>

      <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 space-y-6 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="https://iam.science.kmitl.ac.th/_app/immutable/assets/sci-kmitl-logo.64kyxinc.avif"
            alt="School of Science KMITL"
            width={180}
            height={60}
            className="object-contain"
            unoptimized
            priority
          />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            ระบบบันทึกภาระงาน
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            คณะวิทยาศาสตร์ สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง
          </p>
        </div>

        {/* Login Button */}
        <LoginButton />
      </div>
    </div>
  );
}
