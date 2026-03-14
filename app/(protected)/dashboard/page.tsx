'use client';

import { useTranslation } from 'react-i18next';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { useNotificationsContext } from '@/components/providers/NotificationsProvider';
import { WorkloadProgressCard } from '@/components/dashboard/WorkloadProgressCard';
import { ActiveCoursesCard } from '@/components/dashboard/ActiveCoursesCard';
import { LatestSubmissionCard } from '@/components/dashboard/LatestSubmissionCard';
import { RecentSubmissionsCard } from '@/components/dashboard/RecentSubmissionsCard';
import { NotificationPanel } from '@/components/dashboard/NotificationPanel';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data, loading } = useDashboardData();
  const {
    notifications,
    unreadCount,
    loading: notifLoading,
    markAllAsRead,
    markAsRead,
  } = useNotificationsContext();

  const nowMs = data?.fetchedAt ?? 0;

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="w-full space-y-6">
      {/* ── Page header ── */}
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {t('Dashboard.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs sm:text-sm font-semibold">
          {t('Dashboard.overview')}
        </p>
      </div>

      {/* ── Workload progress — full width ── */}
      <WorkloadProgressCard
        current={data?.currentHours ?? 0}
        target={data?.targetHours ?? 0}
        lectureHours={data?.lectureHours ?? 0}
        labHours={data?.labHours ?? 0}
        adminHours={data?.adminHours ?? 0}
        loading={loading}
      />

      {/*
        ── Bottom section: 2-column layout ──
        Left  : ActiveCourses + LatestSubmission + RecentSubmissions (stacked)
        Right : NotificationPanel (full height)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-4 items-start">

        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Row 1: Active courses + Latest submission */}
          <div className="grid grid-cols-2 gap-4">
            <ActiveCoursesCard count={data?.activeCourses ?? 0} loading={loading} />
            <LatestSubmissionCard status={data?.latestStatus ?? null} loading={loading} />
          </div>

          {/* Row 2: Recent submissions */}
          <RecentSubmissionsCard
            submissions={data?.recentSubmissions ?? []}
            loading={loading}
            nowMs={nowMs}
          />
        </div>

        {/* Right column */}
        <div>
          <NotificationPanel
            notifications={notifications}
            unreadCount={unreadCount}
            loading={notifLoading}
            nowMs={nowMs}
            onMarkAllAsRead={markAllAsRead}
            onMarkAsRead={markAsRead}
          />
        </div>
      </div>
    </div>
  );
}

