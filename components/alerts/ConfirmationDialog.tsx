"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "success" | "warning" | "error" | "info";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  confirmText,
  cancelText,
  variant = "info",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const { t } = useTranslation();
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
    }
  };

  // Color mapping based on variant
  const variantStyles = {
    success: {
      bgIcon: "bg-[#F27F0D]/15",
      textIcon: "text-[#F27F0D]",
      borderButton: "border-[#F27F0D] text-[#F27F0D]",
      bgButton: "bg-[#F27F0D] hover:bg-[#E86D00]",
      borderTop: "border-t-4 border-t-[#F27F0D]",
    },
    warning: {
      bgIcon: "bg-[#F27F0D]/15",
      textIcon: "text-[#F27F0D]",
      borderButton: "border-[#F27F0D] text-[#F27F0D]",
      bgButton: "bg-[#F27F0D] hover:bg-[#E86D00]",
      borderTop: "border-t-4 border-t-[#F27F0D]",
    },
    error: {
      bgIcon: "bg-[#e9575e]/15",
      textIcon: "text-[#e9575e]",
      borderButton: "border-[#e9575e] text-[#e9575e]",
      bgButton: "bg-[#e9575e] hover:bg-[#d84450]",
      borderTop: "border-t-4 border-t-[#e9575e]",
    },
    info: {
      bgIcon: "bg-[#F27F0D]/15",
      textIcon: "text-[#F27F0D]",
      borderButton: "border-[#F27F0D] text-[#F27F0D]",
      bgButton: "bg-[#F27F0D] hover:bg-[#E86D00]",
      borderTop: "border-t-4 border-t-[#F27F0D]",
    },
  };

  const style = variantStyles[variant];
  const IconComponent = variant === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl bg-white dark:bg-[#302826] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${style.borderTop}`}
      >
        {/* Header with Icon */}
        <div className="pt-8 px-6 flex justify-center">
          <div
            className={`inline-flex items-center justify-center h-20 w-20 rounded-full ${style.bgIcon}`}
          >
            <IconComponent className={`h-12 w-12 ${style.textIcon}`} />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-[#f0ebe5] mb-3">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-[#b8aaa0] leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 px-6 py-6 dark:border-[#4a4441]">
          <Button
            onClick={onCancel}
            disabled={isLoading || isConfirming}
            className={`flex-1 h-12 rounded-3xl border-2 font-semibold text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${style.borderButton} bg-transparent hover:bg-gray-50 dark:hover:bg-[#3d3533]`}
          >
            {cancelText || t("Alert.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || isConfirming}
            className={`flex-1 h-12 rounded-3xl font-semibold text-base text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${style.bgButton}`}
          >
            {isConfirming
              ? t("Alert.confirming")
              : confirmText || t("Alert.confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}
