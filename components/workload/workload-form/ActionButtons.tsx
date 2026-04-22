'use client';

import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface ActionButtonsProps {
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ActionButtons({
  onConfirm,
  isLoading = false,
}: ActionButtonsProps) {
  const { currentLanguage } = useLanguage();
  const isTh = currentLanguage === 'th';

  return (
    <div className="flex flex-col gap-2 pt-3 sm:pt-4 w-full">
      {/* Confirm Button — orange, pill shape */}
      <Button
        onClick={onConfirm}
        disabled={isLoading}
        className="w-full h-10 sm:h-12 rounded-full bg-[#F27F0D] hover:bg-[#E06C00] text-white font-semibold text-sm sm:text-base gap-2 dark:bg-[#C96442] dark:hover:bg-[#B5563A] cursor-pointer transition-all duration-200 disabled:opacity-70"
      >
        <Check className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>{isLoading ? (isTh ? 'กำลังบันทึก...' : 'Saving...') : (isTh ? 'ยืนยันข้อมูล' : 'Confirm')}</span>
      </Button>
    </div>
  );
}