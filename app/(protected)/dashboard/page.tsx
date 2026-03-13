'use client';

import { useTranslation } from 'react-i18next';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { WorkloadProgressCard } from '@/components/dashboard/WorkloadProgressCard';
import { ActiveCoursesCard } from '@/components/dashboard/ActiveCoursesCard';
import { LatestSubmissionCard } from '@/components/dashboard/LatestSubmissionCard';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data, loading } = useDashboardData();

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Page header */}
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {t('Dashboard.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs sm:text-sm">
          {t('Dashboard.overview')}
        </p>
      </div>

      {/* Workload progress – full width */}
      <WorkloadProgressCard
        current={data?.currentHours ?? 0}
        target={data?.targetHours ?? 0}
        lectureHours={data?.lectureHours ?? 0}
        labHours={data?.labHours ?? 0}
        adminHours={data?.adminHours ?? 0}
        loading={loading}
      />

      {/* Bottom row: active courses + latest submission */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActiveCoursesCard count={data?.activeCourses ?? 0} loading={loading} />
        <LatestSubmissionCard status={data?.latestStatus ?? null} loading={loading} />
      </div>
    </div>
  );
}

