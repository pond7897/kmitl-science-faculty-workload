"use client";

import { useTranslation } from "react-i18next";

interface WeekSelectionGridProps {
  /** Array of selected lecture week numbers (1–15) */
  lectureWeeks?: number[];
  /** Array of selected lab week numbers (1–15) */
  labWeeks?: number[];
  /** Optional: custom color theme for active weeks (defaults to orange) */
  activeBgColor?: string;
  activeTextColor?: string;
  inactiveBgColor?: string;
  /** Optional: render direction (defaults to 'vertical') */
  direction?: 'vertical' | 'horizontal';
}

const TOTAL_WEEKS = 15;

export function WeekSelectionGrid({
  lectureWeeks = [],
  labWeeks = [],
  activeBgColor = 'bg-[#F27F0D] dark:bg-[#C96442]',
  activeTextColor = 'text-white',
  inactiveBgColor = 'bg-orange-50 dark:bg-orange-500/5',
  direction = 'vertical',
}: WeekSelectionGridProps) {
  const { t } = useTranslation();

  const renderWeekMiniGrid = (
    label: string,
    selectedWeeks: number[],
  ) => {
    const selectedSet = new Set(selectedWeeks);
    const hasAny = selectedWeeks.length > 0;

    return (
      <div key={label} className="space-y-1.5">
        {/* Row label + count */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {label}
          </span>
          {hasAny && (
            <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${activeBgColor} ${activeTextColor}`}>
              {selectedWeeks.length}/{TOTAL_WEEKS}
            </span>
          )}
        </div>

        {/* 15 week cells in a horizontal row */}
        <div className="flex gap-0.5 sm:gap-0.75">
          {Array.from({ length: TOTAL_WEEKS }, (_, i) => {
            const week = i + 1;
            const isActive = selectedSet.has(week);
            return (
              <div
                key={week}
                title={`${label} Week ${week}`}
                className={[
                  "flex-1 h-3 sm:h-3.5 rounded-sm transition-all duration-200",
                  isActive
                    ? `${activeBgColor} shadow-sm`
                    : inactiveBgColor,
                ].join(" ")}
              />
            );
          })}
        </div>

        {/* Week number labels — only first, middle, last */}
        <div className="flex justify-between px-0.5 sm:px-0.75">
          <span className="text-[8px] text-gray-300 dark:text-gray-600 font-medium">1</span>
          <span className="text-[8px] text-gray-300 dark:text-gray-600 font-medium">8</span>
          <span className="text-[8px] text-gray-300 dark:text-gray-600 font-medium">15</span>
        </div>
      </div>
    );
  };

  const hasWeekData = lectureWeeks.length > 0 || labWeeks.length > 0;

  if (!hasWeekData) {
    return null;
  }

  if (direction === 'horizontal') {
    return (
      <div className="flex gap-2 sm:gap-3">
        {renderWeekMiniGrid(t("WorkloadEntry.lecture"), lectureWeeks)}
        {renderWeekMiniGrid(t("WorkloadEntry.lab"), labWeeks)}
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {renderWeekMiniGrid(t("WorkloadEntry.lecture"), lectureWeeks)}
      {renderWeekMiniGrid(t("WorkloadEntry.lab"), labWeeks)}
    </div>
  );
}
