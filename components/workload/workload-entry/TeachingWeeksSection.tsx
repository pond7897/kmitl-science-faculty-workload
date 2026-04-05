"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronUp, Info, CalendarDays } from "lucide-react";

export interface WeekEntry {
  weekNumber: number;
  isSelected: boolean; // ← NEW: card highlight state
  hasSpecialLecturer: boolean; // ← checkbox state (unchanged)
  isLockedByOther?: boolean;
  lockedByName?: string;
}

interface TeachingWeeksSectionProps {
  /** 'lecture' = วิชาทฤษฎี, 'lab' = วิชาปฏิบัติ */
  type: "lecture" | "lab";
  weeks: WeekEntry[];
  onWeeksChange: (weeks: WeekEntry[]) => void;
  /** Default true — collapsible via click on header */
  defaultOpen?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

// ─────────────────────────────────────────────
// Single week tile
// ─────────────────────────────────────────────
function WeekTile({
  week,
  onCardClick,
  onCheckboxChange,
}: {
  week: WeekEntry;
  /** Card click → toggle isSelected */
  onCardClick: () => void;
  /** Checkbox change → toggle hasSpecialLecturer */
  onCheckboxChange: (checked: boolean) => void;
}) {
  const { t } = useTranslation();
  const locked = !!week.isLockedByOther;

  return (
    <div className="flex flex-col gap-2">
      {/* ── Week Card: controls isSelected only ── */}
      <button
        type="button"
        onClick={() => !locked && onCardClick()}
        className={[
          "rounded-xl border py-3 px-2 text-center select-none transition-colors",
          week.isSelected
            ? "bg-orange-100 border-orange-300 dark:bg-[#C96442]/30 dark:border-[#C96442] cursor-pointer"
            : locked
              ? "bg-gray-100 border-gray-200 dark:bg-[#3d3533] dark:border-[#4a4441] cursor-not-allowed"
              : "bg-[#f7f5f3] border-gray-200 dark:bg-[#3d3533] dark:border-[#4a4441] hover:bg-orange-100 hover:border-orange-300 dark:hover:bg-[#C96442]/20 dark:hover:border-[#C96442] cursor-pointer",
        ].join(" ")}
      >
        <p
          className={[
            "text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-0.5",
            week.isSelected || locked
              ? "text-[#F27F0D] dark:text-[#C96442]"
              : "text-gray-400 dark:text-[#8b7f77]",
          ].join(" ")}
        >
          WEEK
        </p>
        <p
          className={[
            "text-xl sm:text-2xl font-black leading-none",
            week.isSelected || locked
              ? "text-[#F27F0D] dark:text-[#C96442]"
              : "text-gray-800 dark:text-[#f0ebe5]",
          ].join(" ")}
        >
          {String(week.weekNumber).padStart(2, "0")}
        </p>
      </button>

      {/* ── Checkbox / Locked indicator: controls hasSpecialLecturer only ── */}
      {locked ? (
        <div className="flex items-start gap-1 px-0.5 min-h-5">
          <Info className="h-3 w-3 text-[#F27F0D] dark:text-[#C96442] shrink-0 mt-px" />
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-[#8b7f77] leading-tight">
            {t("WorkloadEntry.lockedBy")}{" "}
            <span className="font-semibold text-gray-700 dark:text-[#e8e0d8]">
              {week.lockedByName}
            </span>
          </span>
        </div>
      ) : (
        <label
          className="flex items-start gap-1.5 px-0.5 cursor-pointer min-h-5"
          // Stop propagation so clicking the label area never bubbles to the card button
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={week.hasSpecialLecturer}
            onChange={(e) => {
              e.stopPropagation();
              onCheckboxChange(e.target.checked);
            }}
            className="mt-px h-3.5 w-3.5 rounded border-gray-300 accent-orange-500 cursor-pointer shrink-0"
          />
          <span className="text-[10px] sm:text-xs text-gray-600 dark:text-[#8b7f77] leading-tight">
            {t("WorkloadEntry.specialLecturer")}
          </span>
        </label>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────
export function TeachingWeeksSection({
  type,
  weeks,
  onWeeksChange,
  defaultOpen = true,
  hasError = false,
  errorMessage,
}: TeachingWeeksSectionProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const typeLabel =
    type === "lecture" ? t("WorkloadEntry.lecture") : t("WorkloadEntry.lab");

  const sectionLabel = t("WorkloadEntry.teachingWeeks");

  // "Select all" checkbox → bulk-toggle hasSpecialLecturer on editable weeks only
  const editableWeeks = weeks.filter((w) => !w.isLockedByOther);
  const allChecked =
    editableWeeks.length > 0 &&
    editableWeeks.every((w) => w.hasSpecialLecturer);
  const someChecked = editableWeeks.some((w) => w.hasSpecialLecturer);
  const handleSelectAll = (checked: boolean) => {
    onWeeksChange(
      weeks.map((w) =>
        w.isLockedByOther
          ? w
          : { ...w, isSelected: checked, hasSpecialLecturer: checked },
      ),
    );
  };

  /** Card clicked → toggle isSelected for that week */
  const handleCardClick = (weekNumber: number) => {
    onWeeksChange(
      weeks.map((w) =>
        w.weekNumber === weekNumber ? { ...w, isSelected: !w.isSelected } : w,
      ),
    );
  };

  /** Checkbox changed → toggle hasSpecialLecturer for that week */
  const handleCheckboxChange = (weekNumber: number, checked: boolean) => {
    onWeeksChange(
      weeks.map((w) =>
        w.weekNumber === weekNumber ? { ...w, hasSpecialLecturer: checked } : w,
      ),
    );
  };

  return (
    <div>
      <div
        className={[
          "rounded-lg border bg-white dark:bg-[#302826] overflow-hidden border-l-4 border-l-orange-400 dark:border-l-[#C96442] transition-all",
          hasError
            ? "border-red-400 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-500/20"
            : "border-gray-200 dark:border-[#4a4441]",
        ].join(" ")}
      >
      {/* ── Collapsible Header ── */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-4 sm:py-5 hover:bg-gray-50 dark:hover:bg-[#3d3533] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-orange-100 dark:bg-[#C96442]/20 text-orange-600 dark:text-[#C96442]">
            <CalendarDays className="h-4 w-4" />
          </span>
          <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-[#f0ebe5]">
            {sectionLabel}
          </span>
          <span className="text-gray-400 dark:text-[#5a5350]">/</span>
          <span className="text-base sm:text-lg font-bold text-[#F27F0D] dark:text-[#C96442]">
            {typeLabel}
          </span>
        </div>
        <ChevronUp
          className={[
            "h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-[#8b7f77] transition-transform duration-200",
            isOpen ? "" : "rotate-180",
          ].join(" ")}
        />
      </button>

      {/* Orange divider line (always visible) */}
      <div className="h-0.5 bg-[#F27F0D] dark:bg-[#C96442] mx-4 sm:mx-5" />

      {/* ── Collapsible Body ── */}
      {isOpen && (
        <div className="px-4 sm:px-5 py-4 sm:py-5 space-y-4">
          {/* Select All — bulk-toggles hasSpecialLecturer checkboxes */}
          <label className="inline-flex items-center gap-2 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={allChecked}
              ref={(el) => {
                if (el) el.indeterminate = !allChecked && someChecked;
              }}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-orange-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-[#e8e0d8]">
              {t("WorkloadEntry.selectAll")}
            </span>
          </label>

          {/* Week Grid — 2 cols mobile, 4 cols sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {weeks.map((week) => (
              <WeekTile
                key={week.weekNumber}
                week={week}
                onCardClick={() => handleCardClick(week.weekNumber)}
                onCheckboxChange={(checked) =>
                  handleCheckboxChange(week.weekNumber, checked)
                }
              />
            ))}
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 dark:bg-amber-900/10 dark:border-amber-900/30">
            <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-gray-600 dark:text-[#8b7f77] leading-relaxed">
              {t("WorkloadEntry.noteSpecialLecturer")}
            </p>
          </div>
        </div>
      )}
      </div>
      {hasError && errorMessage && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 px-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Helper: build a fresh 15-week array
// optionally pass locked weeks from the API
// ─────────────────────────────────────────────
export function buildDefaultWeeks(
  totalWeeks = 15,
  lockedWeeks: { weekNumber: number; lockedByName: string }[] = [],
): WeekEntry[] {
  return Array.from({ length: totalWeeks }, (_, i) => {
    const n = i + 1;
    const locked = lockedWeeks.find((l) => l.weekNumber === n);
    return {
      weekNumber: n,
      isSelected: false, // ← new field, default false
      hasSpecialLecturer: false,
      isLockedByOther: !!locked,
      lockedByName: locked?.lockedByName,
    };
  });
}
