"use client";

interface SummaryCardProps {
  title: string;
  items: Array<{
    label: string;
    value: string | number;
  }>;
}

export function SummaryCard({ title, items }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-[#4a4441] dark:bg-[#302826]">
      <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-bold text-gray-900 dark:text-[#f0ebe5] pb-3 border-b border-gray-200 dark:border-[#4a4441]">
        {title}
      </h3>
      <div className="space-y-2 sm:space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm text-gray-600 dark:text-[#b8aaa0]">
              {item.label}
            </span>
            <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-[#f0ebe5]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
