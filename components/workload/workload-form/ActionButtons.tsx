'use client';

import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-react';

interface ActionButtonsProps {
  onDownloadExcel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ActionButtons({
  onDownloadExcel,
  onConfirm,
  isLoading = false,
}: ActionButtonsProps) {
  const { currentLanguage } = useLanguage();
  const isTh = currentLanguage === 'th';

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-3 sm:pt-4">
      {/* Download Excel Button — dark green, pill shape */}
      <Button
        onClick={onDownloadExcel}
        className="flex-1 h-10 sm:h-12 rounded-full bg-green-700 hover:bg-green-800 text-white font-semibold text-sm sm:text-base gap-2 dark:bg-green-700 dark:hover:bg-green-800 cursor-pointer"
      >
        <Download className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>{isTh ? 'ดาวน์โหลด Excel' : 'Download Excel'}</span>
      </Button>

      {/* Confirm Button — orange, pill shape */}
      <Button
        onClick={onConfirm}
        disabled={isLoading}
        className="flex-1 h-10 sm:h-12 rounded-full bg-[#F27F0D] hover:bg-[#E06C00] text-white font-semibold text-sm sm:text-base gap-2 dark:bg-[#C96442] dark:hover:bg-[#B5563A] cursor-pointer"
      >
        <Check className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>{isLoading ? (isTh ? 'กำลังบันทึก...' : 'Saving...') : (isTh ? 'ยืนยันข้อมูล' : 'Confirm')}</span>
      </Button>
    </div>
  );
}