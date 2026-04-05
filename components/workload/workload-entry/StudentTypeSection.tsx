"use client";

import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { AppSelect } from "@/components/ui/AppSelect";

interface StudentTypeSectionProps {
  faculty: string;
  onFacultyChange: (value: string) => void;
  major: string;
  onMajorChange: (value: string) => void;
  year: string;
  onYearChange: (value: string) => void;
  group: string;
  onGroupChange: (value: string) => void;
  enrolledStudents: string;
  onEnrolledStudentsChange: (value: string) => void;
  weeklyStudents: string;
  onWeeklyStudentsChange: (value: string) => void;
  errors?: Record<string, string>;
}

/** Wraps AppSelect with a red ring (on the select only) + error message below */
function FieldWrapper({
  hasError,
  errorMessage,
  children,
}: {
  hasError: boolean;
  errorMessage?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className={[
          "rounded-xl transition-all",
          hasError ? "ring-2 ring-red-400 dark:ring-red-500" : "",
        ].join(" ")}
      >
        {children}
      </div>
      {hasError && errorMessage && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-1 px-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export function StudentTypeSection({
  faculty,
  onFacultyChange,
  major,
  onMajorChange,
  year,
  onYearChange,
  group,
  onGroupChange,
  enrolledStudents,
  onEnrolledStudentsChange,
  weeklyStudents,
  onWeeklyStudentsChange,
  errors = {},
}: StudentTypeSectionProps) {
  const { t } = useTranslation();

  const faculties = [
    { value: "science", label: t("WorkloadEntry.facultyScience") },
    { value: "engineering", label: t("WorkloadEntry.facultyEngineering") },
    { value: "business", label: t("WorkloadEntry.facultyBusiness") },
  ];

  const majors = [
    { value: "cs", label: t("WorkloadEntry.computerScience") },
    { value: "it", label: t("WorkloadEntry.informationTechnology") },
    { value: "ds", label: t("WorkloadEntry.dataScience") },
  ];

  const years = [
    { value: "1", label: t("WorkloadEntry.year1") },
    { value: "2", label: t("WorkloadEntry.year2") },
    { value: "3", label: t("WorkloadEntry.year3") },
    { value: "4", label: t("WorkloadEntry.year4") },
  ];

  const groups = [
    { value: "a", label: t("WorkloadEntry.group1") },
    { value: "b", label: t("WorkloadEntry.group2") },
    { value: "c", label: t("WorkloadEntry.group3") },
    { value: "d", label: t("WorkloadEntry.group4") },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-[#4a4441] dark:bg-[#302826] border-l-4 border-l-orange-400 dark:border-l-[#C96442]">
      {/* Section Header */}
      <div className="mb-4 sm:mb-5 pb-3 sm:pb-4 border-b-2 border-[#F27F0D] dark:border-[#C96442]">
        <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-[#f0ebe5]">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-orange-100 dark:bg-[#C96442]/20 text-orange-600 dark:text-[#C96442]">
            <Users className="h-4 w-4" />
          </span>
          {t("WorkloadEntry.studentType")}
        </h2>
      </div>

      {/* Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
        {/* Faculty */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.faculty")} <span className="text-red-500">*</span>
          </Label>
          <FieldWrapper hasError={!!errors.faculty} errorMessage={errors.faculty}>
            <AppSelect
              value={faculty}
              onChange={onFacultyChange}
              options={faculties}
              placeholder={t("WorkloadEntry.selectFaculty")}
            />
          </FieldWrapper>
        </div>

        {/* Major */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.major")} <span className="text-red-500">*</span>
          </Label>
          <FieldWrapper hasError={!!errors.major} errorMessage={errors.major}>
            <AppSelect
              value={major}
              onChange={onMajorChange}
              options={majors}
              placeholder={t("WorkloadEntry.selectMajor")}
            />
          </FieldWrapper>
        </div>

        {/* Year */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.year")} <span className="text-red-500">*</span>
          </Label>
          <FieldWrapper hasError={!!errors.year} errorMessage={errors.year}>
            <AppSelect
              value={year}
              onChange={onYearChange}
              options={years}
              placeholder={t("WorkloadEntry.selectYear")}
            />
          </FieldWrapper>
        </div>

        {/* Group */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.group")} <span className="text-red-500">*</span>
          </Label>
          <FieldWrapper hasError={!!errors.group} errorMessage={errors.group}>
            <AppSelect
              value={group}
              onChange={onGroupChange}
              options={groups}
              placeholder={t("WorkloadEntry.selectGroup")}
            />
          </FieldWrapper>
        </div>
      </div>

      {/* Student Count Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Enrolled Students */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.enrolledStudents")} <span className="text-red-500">*</span>
          </Label>
          <input
            type="number"
            value={enrolledStudents}
            onChange={(e) => onEnrolledStudentsChange(e.target.value)}
            placeholder="e.g., 67"
            min="0"
            className={[
              "w-full px-3.5 py-2.5 rounded-xl border-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 dark:text-[#f0ebe5] dark:placeholder:text-[#5a5350]",
              errors.enrolledStudents
                ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-500 dark:bg-red-900/20 dark:focus:border-red-400 dark:focus:ring-red-500/20"
                : "border-gray-200 bg-white hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-[#4a4441] dark:bg-[#3d3533] dark:hover:border-[#C96442]/60 dark:focus:border-[#C96442] dark:focus:ring-[#C96442]/20",
            ].join(" ")}
          />
          {errors.enrolledStudents && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              {errors.enrolledStudents}
            </p>
          )}
        </div>

        {/* Weekly Students */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.weeklyStudents")} <span className="text-red-500">*</span>
          </Label>
          <input
            type="number"
            value={weeklyStudents}
            onChange={(e) => onWeeklyStudentsChange(e.target.value)}
            placeholder="e.g., 67"
            min="0"
            className={[
              "w-full px-3.5 py-2.5 rounded-xl border-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 dark:text-[#f0ebe5] dark:placeholder:text-[#5a5350]",
              errors.weeklyStudents
                ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-500 dark:bg-red-900/20 dark:focus:border-red-400 dark:focus:ring-red-500/20"
                : "border-gray-200 bg-white hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-[#4a4441] dark:bg-[#3d3533] dark:hover:border-[#C96442]/60 dark:focus:border-[#C96442] dark:focus:ring-[#C96442]/20",
            ].join(" ")}
          />
          {errors.weeklyStudents && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              {errors.weeklyStudents}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}