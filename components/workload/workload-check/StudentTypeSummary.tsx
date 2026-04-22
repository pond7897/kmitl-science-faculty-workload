"use client";

import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StudentTypeSummaryProps {
  faculty: string;
  major: string;
  year: string;
  studyGroup: string;
  studyGroupLabel?: string; // ← เพิ่ม: ใช้แสดง label ที่ resolve แล้วจาก options
  enrolledStudents: string;
  weeklyStudents: string;
}

export function StudentTypeSummary({
  faculty,
  major,
  year,
  studyGroup,
  studyGroupLabel,
  enrolledStudents,
  weeklyStudents,
}: StudentTypeSummaryProps) {
  const { t } = useTranslation();

  // ─── Mapping for display names ───
  const facultyMap: Record<string, string> = {
    science: t("WorkloadEntry.facultyScience"),
    engineering: t("WorkloadEntry.facultyEngineering"),
    business: t("WorkloadEntry.facultyBusiness"),
  };

  const majorMap: Record<string, string> = {
    cs: t("WorkloadEntry.computerScience"),
    it: t("WorkloadEntry.informationTechnology"),
    ds: t("WorkloadEntry.dataScience"),
    am: t("WorkloadEntry.appliedMathematics"),
  };

  const yearMap: Record<string, string> = {
    "1": t("WorkloadEntry.year1"),
    "2": t("WorkloadEntry.year2"),
    "3": t("WorkloadEntry.year3"),
    "4": t("WorkloadEntry.year4"),
  };

  const groupMap: Record<string, string> = {
    a: t("WorkloadEntry.group1"),
    b: t("WorkloadEntry.group2"),
    c: t("WorkloadEntry.group3"),
    d: t("WorkloadEntry.group4"),
  };

  // ถ้ามี studyGroupLabel ที่ resolve แล้วจาก options ให้ใช้เลย
  // ถ้าไม่มี → ลอง groupMap → fallback เป็น raw value
  const groupDisplay = studyGroupLabel || groupMap[studyGroup] || studyGroup;

  const items = [
    { label: t("WorkloadFormCheck.faculty"),          value: facultyMap[faculty] || faculty },
    { label: t("WorkloadFormCheck.major"),            value: majorMap[major] || major },
    { label: t("WorkloadFormCheck.year"),             value: yearMap[year] || year },
    { label: t("WorkloadFormCheck.studyGroup"),       value: groupDisplay },
    { label: t("WorkloadFormCheck.enrolledStudents"), value: enrolledStudents },
    { label: t("WorkloadFormCheck.weeklyStudents"),   value: weeklyStudents },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-[#4a4441] dark:bg-[#302826] border-l-4 border-l-orange-400 dark:border-l-[#C96442]">
      {/* Section Header */}
      <div className="mb-4 sm:mb-5 pb-3 sm:pb-4 border-b-2 border-[#F27F0D] dark:border-[#C96442]">
        <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-[#f0ebe5]">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-orange-100 dark:bg-[#C96442]/20 text-orange-600 dark:text-[#C96442]">
            <Users className="h-4 w-4" />
          </span>
          {t("WorkloadFormCheck.studentType")}
        </h2>
      </div>

      {/* 2-col grid — each row: label left, value right */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 sm:gap-y-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-2"
          >
            <span className="text-xs sm:text-sm text-gray-500 dark:text-[#b8aaa0] shrink-0">
              {item.label}
            </span>
            <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-[#f0ebe5] text-right">
              {item.value || "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}