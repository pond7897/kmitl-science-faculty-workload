"use client";

import { useState } from "react";
import { FileText, Image as ImageIcon, ZoomIn } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AttachmentDisplayProps {
  fileName?: string | null;
  fileData?: string | null; // Base64 encoded file data
  onPreviewClick?: (fileName: string, fileData: string) => void;
  // ข้อมูลการสอน
  courseCode?: string;
  courseName?: string;
  creditUnits?: number | null;
  degreeLevel?: string;
  facultyName?: string;
  majorName?: string;
  yearName?: string;
  groupName?: string;
  enrolledStudents?: string;
  weeklyStudents?: string;
  lectureTimeStart?: string;
  lectureTimeEnd?: string;
  labTimeStart?: string;
  labTimeEnd?: string;
  notes?: string;
}

export function AttachmentDisplay({
  fileName,
  fileData,
  onPreviewClick,
  courseCode,
  courseName,
  creditUnits,
  degreeLevel,
  facultyName,
  majorName,
  yearName,
  groupName,
  enrolledStudents,
  weeklyStudents,
  lectureTimeStart,
  lectureTimeEnd,
  labTimeStart,
  labTimeEnd,
  notes,
}: AttachmentDisplayProps) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  const isImage = fileName && /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  const showPreview = isImage && fileData && !imageError;

  // แปลงรหัสระดับปริญญา
  const degreeLevelMap: Record<string, string> = {
    bachelor_regular: t("WorkloadEntry.degreeLevelBachelor"),
    bachelor_international: t("WorkloadEntry.degreeLevelInternational"),
    master: t("WorkloadEntry.degreeLevelMaster"),
  };
  const degreeLevelDisplay = degreeLevel
    ? degreeLevelMap[degreeLevel] || degreeLevel
    : "—";

  // แปลง Faculty, Major, Year, Group ให้ตรงกับ StudentTypeSection.tsx
  const facultyMap: Record<string, string> = {
    science: t("WorkloadEntry.facultyScience"),
    engineering: t("WorkloadEntry.facultyEngineering"),
    business: t("WorkloadEntry.facultyBusiness"),
  };
  const facultyDisplay = facultyName
    ? facultyMap[facultyName] || facultyName
    : "—";

  const majorMap: Record<string, string> = {
    cs: t("WorkloadEntry.computerScience"),
    it: t("WorkloadEntry.informationTechnology"),
    ds: t("WorkloadEntry.dataScience"),
    am: t("WorkloadEntry.appliedMathematics"),
  };
  const majorDisplay = majorName ? majorMap[majorName] || majorName : "—";

  const yearMap: Record<string, string> = {
    "1": t("WorkloadEntry.year1"),
    "2": t("WorkloadEntry.year2"),
    "3": t("WorkloadEntry.year3"),
    "4": t("WorkloadEntry.year4"),
  };
  const yearDisplay = yearName ? yearMap[yearName] || yearName : "—";

  const groupMap: Record<string, string> = {
    a: t("WorkloadEntry.group1"),
    b: t("WorkloadEntry.group2"),
    c: t("WorkloadEntry.group3"),
    d: t("WorkloadEntry.group4"),
  };
  const groupDisplay = groupName ? groupMap[groupName] || groupName : "—";

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      {fileName ? (
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* File Info Card */}
          <div className="flex items-center gap-3 w-full px-3 sm:px-4 py-3 rounded-xl border-2 border-orange-300 bg-orange-50 dark:border-[#C96442]/50 dark:bg-[#C96442]/10 transition-colors">
            <span className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-lg bg-orange-100 dark:bg-[#C96442]/20">
              {isImage ? (
                <ImageIcon className="h-5 w-5 text-orange-500 dark:text-[#C96442]" />
              ) : (
                <FileText className="h-5 w-5 text-orange-500 dark:text-[#C96442]" />
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-[#f0ebe5] truncate leading-tight">
                {fileName}
              </p>
              <p className="text-xs text-gray-500 dark:text-[#8b7f77] mt-0.5">
                {t("WorkloadEntry.fileAttached")}
              </p>
            </div>
            {showPreview && onPreviewClick && (
              <button
                type="button"
                onClick={() => onPreviewClick(fileName, fileData)}
                className="shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full text-gray-400 hover:bg-orange-200 hover:text-orange-600 dark:hover:bg-[#C96442]/30 dark:hover:text-[#C96442] transition-colors cursor-pointer"
                aria-label={t("WorkloadEntry.previewImage")}
                title={t("WorkloadEntry.previewImage")}
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Image Preview Thumbnail */}
          {showPreview && (
            <div
              onClick={() => onPreviewClick?.(fileName, fileData)}
              className="relative cursor-pointer w-full aspect-video overflow-hidden rounded-xl border-2 border-gray-200 dark:border-[#4a4441] bg-gray-100 dark:bg-[#3d3533] shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/${fileName.split(".").pop()};base64,${fileData}`}
                alt={fileName}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
              {/* Zoom Icon on Hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 opacity-0 hover:opacity-100 transition-all duration-200">
                <ZoomIn className="h-6 w-6 text-white drop-shadow-lg" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="px-3 sm:px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 dark:border-[#4a4441] dark:bg-[#3d3533] min-h-14 sm:min-h-16 flex items-center justify-center">
          <span className="text-sm text-gray-400 dark:text-[#5a5350]">—</span>
        </div>
      )}

      {/* หมายเหตุ */}
      {notes && (
        <div className="space-y-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600">
          <p className="text-xs sm:text-sm font-semibold text-yellow-700 dark:text-yellow-400">
            📝 {t("WorkloadFormCheck.notes")}
          </p>
          <p className="text-sm sm:text-base text-gray-900 dark:text-[#f0ebe5] whitespace-pre-wrap">
            {notes}
          </p>
        </div>
      )}
    </div>
  );
}
