"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Pen, Check } from "lucide-react";

interface CheckActionButtonsProps {
  onEdit: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function CheckActionButtons({
  onEdit,
  onConfirm,
  isLoading = false,
}: CheckActionButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-3 sm:pt-4">
      {/* Edit Button — outlined orange */}
      <Button
        onClick={onEdit}
        disabled={isLoading}
        className="flex-1 h-10 sm:h-12 rounded-full border-2 border-orange-400 text-orange-500 bg-orange-50 hover:bg-orange-100 font-semibold text-sm sm:text-base gap-2 dark:border-[#C96442] dark:text-[#f0ebe5] dark:bg-[#C96442]/20 dark:hover:bg-[#C96442]/30 cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Pen className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>{t("WorkloadFormCheck.edit")}</span>
      </Button>

      {/* Confirm Button — orange filled */}
      <Button
        onClick={onConfirm}
        disabled={isLoading}
        className="flex-1 h-10 sm:h-12 rounded-full bg-[#F27F0D] hover:bg-[#E06C00] text-white font-semibold text-sm sm:text-base gap-2 dark:bg-[#C96442] dark:hover:bg-[#B5563A] cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Check className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>
          {isLoading ? t("WorkloadFormCheck.confirming") : t("WorkloadFormCheck.confirm")}
        </span>
      </Button>
    </div>
  );
}
