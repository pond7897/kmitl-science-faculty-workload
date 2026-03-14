import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Workload progress card — full width */}
      <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-4 w-full rounded-full" />
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom section: 2-column layout (matches real layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-4 items-start">

        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Row 1: Active courses + Latest submission */}
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#2a2a2a] rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm flex flex-col gap-3 sm:gap-4"
              >
                <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>

          {/* Row 2: Recent submissions */}
          <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b-2 border-gray-100 dark:border-gray-700">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Skeleton className="h-6 w-28 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Notification panel */}
        <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Header: title + unread badge | clear-all button */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          {/* Divider */}
          <div className="mx-4 h-px bg-gray-100 dark:bg-gray-700" />
          {/* Notification items */}
          <ul className="px-1.5 sm:px-2 py-2 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl">
                {/* Icon circle */}
                <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0" />
                {/* Body */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Title row + NEW badge */}
                  <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-4 w-3/5" />
                    <Skeleton className="h-4 w-8 rounded-full shrink-0" />
                  </div>
                  {/* Description */}
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  {/* Relative time */}
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
