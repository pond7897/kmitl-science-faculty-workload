"use client";

import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { AppSelect, type SelectOption } from "@/components/ui/AppSelect";

interface StudentTypeSectionProps {
  faculty: string;
  major: string;
  year: string;
  studyGroup: string;
  enrolledStudents: string;
  facultyOptions?: SelectOption[];
  majorOptions?: SelectOption[];
  yearOptions?: SelectOption[];
  studyGroupOptions?: SelectOption[];
  onFacultyChange?: (value: string) => void;
  onMajorChange?: (value: string) => void;
  onYearChange?: (value: string) => void;
  onStudyGroupChange?: (value: string) => void;
  onEnrolledStudentsChange?: (value: string) => void;
  disableStudentFields?: boolean; // เมื่อกรอกอัตโนมัติจากการค้นหา
}

export function StudentTypeSection({
  faculty,
  major,
  year,
  studyGroup,
  enrolledStudents,
  facultyOptions = [],
  majorOptions = [],
  yearOptions = [],
  studyGroupOptions = [],
  onFacultyChange,
  onMajorChange,
  onYearChange,
  onStudyGroupChange,
  onEnrolledStudentsChange,
  disableStudentFields = false,
}: StudentTypeSectionProps) {
  const { t } = useTranslation();

  const getOptionLabel = (value: string, options: SelectOption[]) =>
    options.find((option) => option.value === value)?.label || value || "";

  // ตรวจสอบว่ามี onChange handler ไหม - ถ้ามี = editable, ถ้าไม่มี = readonly
  const isEditable = !!(onFacultyChange || onMajorChange || onYearChange || onStudyGroupChange);

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

      {/* Display-only Grid: responsive columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5">
        {/* Faculty */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.faculty")}
          </Label>
          {isEditable && !disableStudentFields && facultyOptions.length > 1 ? (
            <AppSelect
              value={faculty}
              onChange={(value) => onFacultyChange?.(value)}
              options={facultyOptions}
              placeholder={t("WorkloadEntry.selectFaculty")}
              className="h-10 sm:h-11"
            />
          ) : (
            <div className="px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-gray-700 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#e8e0d8] h-10 sm:h-11 flex items-center">
              {getOptionLabel(faculty, facultyOptions)}
            </div>
          )}
        </div>

        {/* Major */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.major")}
          </Label>
          {isEditable && !disableStudentFields && majorOptions.length > 1 ? (
            <AppSelect
              value={major}
              onChange={(value) => onMajorChange?.(value)}
              options={majorOptions}
              placeholder={t("WorkloadEntry.selectMajor")}
              className="h-10 sm:h-11"
            />
          ) : (
            <div className="px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-gray-700 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#e8e0d8] h-10 sm:h-11 flex items-center">
              {getOptionLabel(major, majorOptions)}
            </div>
          )}
        </div>

        {/* Year */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.year")}
          </Label>
          {isEditable && !disableStudentFields && yearOptions.length > 1 ? (
            <AppSelect
              value={year}
              onChange={(value) => onYearChange?.(value)}
              options={yearOptions}
              placeholder={t("WorkloadEntry.selectYear")}
              className="h-10 sm:h-11"
            />
          ) : (
            <div className="px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-gray-700 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#e8e0d8] h-10 sm:h-11 flex items-center">
              {getOptionLabel(year, yearOptions)}
            </div>
          )}
        </div>
      </div>

      {/* Display-only Grid: 2 columns on bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Group */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.studyGroup")}
          </Label>
          {isEditable && !disableStudentFields && studyGroupOptions.length > 1 ? (
            <AppSelect
              value={studyGroup}
              onChange={(value) => onStudyGroupChange?.(value)}
              options={studyGroupOptions}
              placeholder={t("WorkloadEntry.selectGroup")}
              className="h-10 sm:h-11"
            />
          ) : (
            <div className="px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-gray-700 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#e8e0d8] h-10 sm:h-11 flex items-center">
              {getOptionLabel(studyGroup, studyGroupOptions)}
            </div>
          )}
        </div>

        {/* Enrolled Students */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.enrolledStudents")}
          </Label>
          {isEditable && !disableStudentFields ? (
            <input
              type="number"
              value={enrolledStudents}
              onChange={(e) => onEnrolledStudentsChange?.(e.target.value)}
              placeholder="0"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-700 h-10 sm:h-11 outline-none transition-colors hover:border-orange-300 focus:border-orange-500 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#e8e0d8] dark:hover:border-[#C96442]/60 dark:focus:border-[#C96442]"
            />
          ) : (
            <div className="px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-gray-700 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#e8e0d8] h-10 sm:h-11 flex items-center">
              {enrolledStudents || ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
