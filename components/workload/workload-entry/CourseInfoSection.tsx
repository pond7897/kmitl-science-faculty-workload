"use client";

import { Search, ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";

interface CourseInfoSectionProps {
  courseCode: string;
  onCourseCodeChange: (value: string) => void;
  onSearch: () => void;
  courseName: string;
  creditUnits: number | null;
  isSearching?: boolean;
  errors?: Record<string, string>;
}

export function CourseInfoSection({
  courseCode,
  onCourseCodeChange,
  onSearch,
  courseName,
  creditUnits,
  isSearching = false,
  errors = {},
}: CourseInfoSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-[#4a4441] dark:bg-[#302826] border-l-4 border-l-orange-400 dark:border-l-[#C96442]">
      {/* Section Header */}
      <div className="mb-4 sm:mb-5 pb-3 sm:pb-4 border-b-2 border-[#F27F0D] dark:border-[#C96442]">
        <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-[#f0ebe5]">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-orange-100 dark:bg-[#C96442]/20 text-orange-600 dark:text-[#C96442]">
            <ClipboardList className="h-4 w-4" />
          </span>
          {t("WorkloadEntry.courseInfo")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12">
        {/* Course Code Input */}
        <div className="lg:col-span-4 space-y-1.5 sm:space-y-2">
          <Label className="text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.courseCode")} <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <input
              type="text"
              value={courseCode}
              onChange={(e) => onCourseCodeChange(e.target.value.toUpperCase())}
              placeholder="กรอกรหัสวิชา เช่น 05016202"
              className={[
                "flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:text-[#f0ebe5] dark:placeholder:text-[#8b7f77] transition-colors",
                errors.courseCode
                  ? "border-red-400 bg-red-50 focus:ring-red-300 dark:border-red-500 dark:bg-red-900/20"
                  : "border-gray-300 bg-white focus:ring-orange-500 dark:border-[#4a4441] dark:bg-[#3d3533]",
              ].join(" ")}
            />
            <button
              onClick={onSearch}
              disabled={!courseCode || isSearching}
              className="inline-flex items-center justify-center h-10 sm:h-11 px-3 sm:px-4 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold transition-colors dark:bg-[#C96442] dark:hover:bg-[#B5563A] dark:disabled:bg-[#4a4441] cursor-pointer shrink-0"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
          {errors.courseCode && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              {errors.courseCode}
            </p>
          )}
        </div>

        {/* Course Name (Read-only) */}
        <div className="lg:col-span-6 space-y-1.5 sm:space-y-2">
          <Label className="text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.courseName")}
          </Label>
          <div
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-sm sm:text-base h-10 sm:h-11 flex items-center overflow-hidden transition-colors ${
              courseName
                ? "border-green-300 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300"
                : errors.courseName
                  ? "border-red-300 bg-red-50 text-red-400 dark:border-red-500 dark:bg-red-900/20 dark:text-red-400"
                  : "border-gray-300 bg-gray-50 text-gray-600 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#8b7f77]"
            }`}
          >
            {courseName && <span className="truncate">{courseName}</span>}
          </div>
          {errors.courseName && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              {errors.courseName}
            </p>
          )}
        </div>

        {/* Credit Units Badge (Read-only) */}
        <div className="lg:col-span-2 space-y-1.5 sm:space-y-2 flex flex-col">
          <Label className="text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.creditUnits")}
          </Label>
          <div className="flex gap-2 h-10 sm:h-11 items-center justify-start">
            {creditUnits !== null ? (
              <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/40 px-2 sm:px-3 py-1.5 text-sm sm:text-base font-semibold text-green-700 dark:text-green-300 shrink-0">
                {creditUnits} {t("WorkloadEntry.units")}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-[#3d3533] px-2 sm:px-3 py-1.5 text-sm sm:text-base text-gray-500 dark:text-[#8b7f77] shrink-0">
                X {t("WorkloadEntry.units")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}