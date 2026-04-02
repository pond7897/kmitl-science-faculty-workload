import { Skeleton } from '@/components/ui/skeleton';

export function ProfileSkeleton() {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* ── Hero card ── */}
      <div className="bg-white dark:bg-[#292524] rounded-2xl border border-gray-100 dark:border-[#4a4441] shadow-sm p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
          {/* Avatar */}
          <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shrink-0" />

          {/* Name + meta */}
          <div className="flex flex-col items-center sm:items-start gap-2 flex-1 w-full">
            <Skeleton className="h-8 w-48 sm:w-64" />
            <Skeleton className="h-5 w-28 sm:w-36" />

            {/* Faculty / Department row */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Info card ── */}
      <div className="bg-white dark:bg-[#292524] rounded-2xl border border-gray-100 dark:border-[#4a4441] shadow-sm p-5 sm:p-8">
        {/* Section heading */}
        <div className="flex items-center gap-2 mb-5 sm:mb-6">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-5 w-32" />
        </div>

        {/* Fields grid */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 sm:gap-y-6 gap-x-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-5 w-40" />
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
