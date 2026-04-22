"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface SuccessAlertProps {
  isOpen: boolean;
  title: string;
  description: string;
  actionText?: string;
  onAction: () => void;
}

export function SuccessAlert({
  isOpen,
  title,
  description,
  actionText,
  onAction,
}: SuccessAlertProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#302826] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-t-4 border-t-green-500 dark:border-t-green-600">
        {/* Content */}
        <div className="pt-8 px-6 pb-6 text-center flex flex-col items-center gap-4">
          {/* Success Icon with Animation */}
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 animate-pulse">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#f0ebe5]">
            {title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-[#b8aaa0] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Button */}
        <div className="px-6 pb-6 flex gap-3 border-t border-gray-200 dark:border-[#4a4441] pt-4">
          <Button
            onClick={onAction}
            className="w-full h-11 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors duration-200 dark:bg-green-600 dark:hover:bg-green-700"
          >
            {actionText || t("Alert.done")}
          </Button>
        </div>
      </div>
    </div>
  );
}
