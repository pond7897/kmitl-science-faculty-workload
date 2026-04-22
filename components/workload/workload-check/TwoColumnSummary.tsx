"use client";

import type { LucideIcon } from "lucide-react";

interface SummaryItem {
  label: string;
  value: string | number;
}

interface TwoColumnSummaryProps {
  leftTitle: string;
  leftItems: SummaryItem[];
  leftIcon?: LucideIcon;
  rightTitle: string;
  rightItems: SummaryItem[];
  rightIcon?: LucideIcon;
}

function SummaryColumn({
  title,
  items,
  Icon,
}: {
  title: string;
  items: SummaryItem[];
  Icon?: LucideIcon;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-[#4a4441] dark:bg-[#302826] border-l-4 border-l-orange-400 dark:border-l-[#C96442]">
      {/* Column Header */}
      <div className="mb-3 sm:mb-4 pb-3 border-b-2 border-[#F27F0D] dark:border-[#C96442]">
        <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900 dark:text-[#f0ebe5]">
          {Icon && (
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-orange-100 dark:bg-[#C96442]/20 text-orange-600 dark:text-[#C96442] shrink-0">
              <Icon className="h-4 w-4" />
            </span>
          )}
          {title}
        </h3>
      </div>

      {/* Items */}
      <div className="space-y-2.5 sm:space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-2"
          >
            <span className="text-xs sm:text-sm text-gray-500 dark:text-[#b8aaa0] shrink-0">
              {item.label}
            </span>
            <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-[#f0ebe5] text-right">
              {item.value ?? "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TwoColumnSummary({
  leftTitle,
  leftItems,
  leftIcon,
  rightTitle,
  rightItems,
  rightIcon,
}: TwoColumnSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <SummaryColumn title={leftTitle}  items={leftItems}  Icon={leftIcon} />
      <SummaryColumn title={rightTitle} items={rightItems} Icon={rightIcon} />
    </div>
  );
}