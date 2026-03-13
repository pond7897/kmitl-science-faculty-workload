'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface WorkloadProgressCardProps {
  current: number;
  target: number;
  lectureHours: number;
  labHours: number;
  adminHours: number;
  loading?: boolean;
}

function AnimatedBar({ percent, loading }: { percent: number; loading?: boolean }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (loading) return;
    const t = requestAnimationFrame(() => {
      setTimeout(() => setWidth(Math.min(percent, 100)), 50);
    });
    return () => cancelAnimationFrame(t);
  }, [percent, loading]);

  if (loading) {
    return <Skeleton className="h-4 w-full rounded-full" />;
  }

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
      <div
        className="h-full rounded-full bg-linear-to-r from-[#F27F0D] to-[#f5a442] transition-all duration-1000 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

interface SubMetricProps {
  label: string;
  value: number;
  unit: string;
  loading?: boolean;
}

function SubMetric({ label, value, unit, loading }: SubMetricProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{label}</p>
      {loading ? (
        <Skeleton className="h-5 w-16" />
      ) : (
        <p className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
          {value}{' '}
          <span className="text-xs sm:text-sm font-base text-gray-500 dark:text-gray-400">{unit}</span>
        </p>
      )}
    </div>
  );
}

export function WorkloadProgressCard({
  current,
  target,
  lectureHours,
  labHours,
  adminHours,
  loading,
}: WorkloadProgressCardProps) {
  const { t } = useTranslation();
  const percent = target > 0 ? (current / target) * 100 : 0;
  const unit = t('Dashboard.hoursUnit');
  const unitShort = t('Dashboard.hoursUnitShort');

  return (
    <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm col-span-full">
      {/* Title */}
      <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">
        {t('Dashboard.teachingHours')}
      </p>

      {/* Current / Target */}
      <div className="flex items-end gap-2 mb-4">
        {loading ? (
          <Skeleton className="h-12 w-32" />
        ) : (
          <>
            <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-none">
              {current}
            </span>
            <span className="text-base sm:text-xl font-bold text-gray-400 dark:text-gray-500 mb-0.5 sm:mb-1">
              / {target} {unit}
            </span>
          </>
        )}
      </div>

      {/* Progress bar */}
      <AnimatedBar percent={percent} loading={loading} />

      {/* Percent label */}
      {!loading && (
        <p className="text-xs text-right text-gray-400 dark:text-gray-500 mt-1">
          {percent.toFixed(1)}%
        </p>
      )}

      {/* Sub-metrics */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-100 dark:border-gray-700 font-semibold">
        <SubMetric label={t('Dashboard.lectureHours')} value={lectureHours} unit={unitShort} loading={loading} />
        <SubMetric label={t('Dashboard.labHours')} value={labHours} unit={unitShort} loading={loading} />
        <SubMetric label={t('Dashboard.adminWork')} value={adminHours} unit={unitShort} loading={loading} />
      </div>
    </div>
  );
}
