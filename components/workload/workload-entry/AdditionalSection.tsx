"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Paperclip, X, UploadCloud, FileText } from "lucide-react";

interface AdditionalSectionProps {
  attachedFile: File | null;
  onFileChange: (file: File | null) => void;
  attachedFileName?: string | null; // แสดงชื่อไฟล์เดิมเมื่อกลับมาแก้ไข
  notes: string;
  onNotesChange: (value: string) => void;
}

export function AdditionalSection({
  attachedFile,
  onFileChange,
  attachedFileName,
  notes,
  onNotesChange,
}: AdditionalSectionProps) {
  const { t } = useTranslation();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0]);
      }
    },
    [onFileChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  });

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-[#4a4441] dark:bg-[#302826] border-l-4 border-l-orange-400 dark:border-l-[#C96442]">
      {/* ── Section Header ── */}
      <div className="mb-4 sm:mb-5 pb-3 sm:pb-4 border-b-2 border-[#F27F0D] dark:border-[#C96442]">
        <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-[#f0ebe5]">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-orange-100 dark:bg-[#C96442]/20 text-orange-600 dark:text-[#C96442]">
            <Paperclip className="h-4 w-4" />
          </span>
          {t("WorkloadEntry.additional")}
        </h2>
      </div>

      {/* ── Two equal-height columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 items-stretch">

        {/* ── Attachment ── */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <Label className="text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.attachment")}
          </Label>

          {attachedFile || attachedFileName ? (
            /* ── File card ── */
            <div className="flex items-center gap-3 flex-1 w-full px-3 sm:px-4 py-3 rounded-xl border-2 border-orange-300 bg-orange-50 dark:border-[#C96442]/50 dark:bg-[#C96442]/10 transition-colors">
              <span className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-lg bg-orange-100 dark:bg-[#C96442]/20">
                <FileText className="h-5 w-5 text-orange-500 dark:text-[#C96442]" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-[#f0ebe5] truncate leading-tight">
                  {attachedFile?.name || attachedFileName}
                </p>
                <p className="text-xs text-gray-400 dark:text-[#8b7f77] mt-0.5">
                  {attachedFile ? formatBytes(attachedFile.size) : t("WorkloadEntry.fileAttached")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onFileChange(null)}
                className="shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors cursor-pointer"
                aria-label={t("WorkloadEntry.removeFile")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* ── Drop zone ── */
            <div
              {...getRootProps()}
              className={[
                "flex-1 flex flex-col items-center justify-center gap-2 w-full px-4 py-5 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer select-none outline-none",
                isDragActive
                  ? "border-orange-400 bg-orange-50 dark:border-[#C96442] dark:bg-[#C96442]/10 scale-[1.01]"
                  : "border-gray-300 bg-gray-50/60 hover:border-orange-300 hover:bg-orange-50/50 dark:border-[#4a4441] dark:bg-[#3d3533] dark:hover:border-[#C96442]/60 dark:hover:bg-[#C96442]/5",
              ].join(" ")}
            >
              <input {...getInputProps()} />

              <span
                className={[
                  "inline-flex items-center justify-center h-10 w-10 rounded-full transition-colors",
                  isDragActive
                    ? "bg-orange-100 dark:bg-[#C96442]/20"
                    : "bg-gray-100 dark:bg-[#4a4441]/60",
                ].join(" ")}
              >
                <UploadCloud
                  className={[
                    "h-5 w-5 transition-colors",
                    isDragActive
                      ? "text-orange-500 dark:text-[#C96442]"
                      : "text-gray-400 dark:text-[#8b7f77]",
                  ].join(" ")}
                />
              </span>

              <div className="text-center leading-snug">
                <p className="text-sm font-semibold text-gray-600 dark:text-[#c8bfb8]">
                  {isDragActive ? (
                    <span className="text-orange-500 dark:text-[#C96442]">
                      {t("WorkloadEntry.dropzoneDragging")}
                    </span>
                  ) : (
                    <>
                      <span className="text-orange-500 dark:text-[#C96442] underline underline-offset-2 decoration-dotted">
                        {t("WorkloadEntry.dropzoneClick")}
                      </span>{" "}
                      {t("WorkloadEntry.dropzoneDrag")}
                    </>
                  )}
                </p>
                <p className="mt-1 text-[11px] text-gray-400 dark:text-[#5a5350]">
                  {t("WorkloadEntry.dropzoneFormats")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Notes: flex-1 textarea stretches to fill column height ── */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <Label className="text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.notes")}
          </Label>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="flex-1 w-full min-h-[120px] px-3 sm:px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-900 resize-none outline-none transition-all duration-200 hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#f0ebe5] dark:hover:border-[#C96442]/60 dark:focus:border-[#C96442] dark:focus:ring-[#C96442]/20"
          />
        </div>

      </div>
    </div>
  );
}