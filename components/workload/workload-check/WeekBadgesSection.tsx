"use client";

import { CalendarDays, User } from "lucide-react";

interface WeekChip {
  weekNumber: number;
  isSelected: boolean;
  hasSpecialLecturer?: boolean;
  isLockedByOther?: boolean;
  lockedByName?: string;
  coLecturerName?: string;
}

interface WeekBadgesSectionProps {
  title: string;
  typeLabel?: string; // e.g. "วิชาทฤษฎี" — shown in orange after "/"
  weeks: WeekChip[];
}

export function WeekBadgesSection({
  title,
  typeLabel,
  weeks,
}: WeekBadgesSectionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-[#4a4441] dark:bg-[#302826] border-l-4 border-l-orange-400 dark:border-l-[#C96442]">
      {/* Section Header */}
      <div className="mb-4 sm:mb-5 pb-3 sm:pb-4 border-b-2 border-[#F27F0D] dark:border-[#C96442]">
        <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-[#f0ebe5]">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-orange-100 dark:bg-[#C96442]/20 text-orange-600 dark:text-[#C96442]">
            <CalendarDays className="h-4 w-4" />
          </span>
          <span>{title}</span>
          {typeLabel && (
            <>
              <span className="text-gray-400 dark:text-[#5a5350]">/</span>
              <span className="text-[#F27F0D] dark:text-[#C96442]">{typeLabel}</span>
            </>
          )}
        </h2>
      </div>

      {/* Badge Grid — responsive grid layout */}
      <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-8 gap-2 sm:gap-2.5">
        {weeks.map((week) => {
          const isSelected = week.isSelected;
          const hasSpecialLecturer = week.hasSpecialLecturer;
          const coLecturerName = week.coLecturerName;

          return (
            <div key={week.weekNumber} className="flex flex-col gap-1.5">
              {/* Week Badge */}
              <div
                className={[
                  "h-10 sm:h-11 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap",
                  "flex items-center justify-center select-none relative transition-all duration-200",
                  isSelected
                    ? "bg-[#F27F0D] text-white shadow-md dark:bg-[#C96442]"
                    : "border-2 border-gray-300 text-gray-400 bg-gray-100 dark:border-[#3d3533] dark:bg-[#2a2622] dark:text-[#6b6560]",
                ].join(" ")}
              >
                WEEK {week.weekNumber}
                
                {/* Special Lecturer Indicator */}
                {hasSpecialLecturer && !coLecturerName && (
                  <div className="absolute -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#F27F0D] dark:bg-[#C96442] shadow-lg ring-2 ring-white dark:ring-[#2a2622]">
                    <User className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
              </div>
              
              {/* Co-Lecturer Name */}
              {coLecturerName && (
                <div className="text-center">
                  <p className="text-xs font-medium text-orange-600 dark:text-orange-300 line-clamp-1">
                    {coLecturerName}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {weeks.some((w) => w.hasSpecialLecturer) && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#4a4441]">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm">
            {weeks.some((w) => w.hasSpecialLecturer) && (
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#F27F0D] dark:bg-[#C96442]">
                  <User className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="text-gray-600 dark:text-[#b8aaa0]">มีวิทยากรพิเศษ</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}