"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ImagePreviewModalProps {
  isOpen: boolean;
  fileName: string;
  fileData: string;
  onClose: () => void;
}

export function ImagePreviewModal({
  isOpen,
  fileName,
  fileData,
  onClose,
}: ImagePreviewModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const fileExt = fileName.split(".").pop() || "png";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-11/12 max-w-2xl max-h-[92vh] bg-white dark:bg-[#302826] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-[#4a4441]">
          <h2 className="text-base font-semibold text-gray-900 dark:text-[#f0ebe5] truncate">
            {fileName}
          </h2>
          <button
            onClick={onClose}
            className="shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#4a4441] dark:hover:text-[#b8aaa0] transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Image Container */}
        <div className="flex items-center justify-center flex-1 p-2 bg-gray-50 dark:bg-[#3d3533] min-h-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/${fileExt};base64,${fileData}`}
            alt={fileName}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-gray-200 dark:border-[#4a4441] bg-white dark:bg-[#302826] flex items-center justify-between shrink-0">
          <span className="text-xs text-gray-500 dark:text-[#8b7f77] truncate flex-1">
            {fileName}
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs transition-colors dark:bg-[#C96442] dark:hover:bg-[#B5563A] whitespace-nowrap ml-2 shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
