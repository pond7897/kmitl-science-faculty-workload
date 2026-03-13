import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Workload progress card */}
      <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm space-y-4">
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

      {/* Bottom row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#2a2a2a] rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm space-y-3"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
