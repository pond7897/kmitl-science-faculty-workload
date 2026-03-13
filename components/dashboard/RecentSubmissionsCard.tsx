'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Submission } from '@/hooks/use-dashboard-data';
import type { SubmissionStatus } from '@/components/dashboard/LatestSubmissionCard';

// ─── Status badge config ────────────────────────────────────────────────────

interface BadgeConfig {
  labelKey: string;
  className: string;
  dotColor: string;
}

const badgeConfig: Record<SubmissionStatus, BadgeConfig> = {
  pending: {
    labelKey: 'Dashboard.statusPending',
    className:
      'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    dotColor: 'bg-amber-400',
  },
  processing: {
    labelKey: 'Dashboard.statusProcessing',
    className:
      'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    dotColor: 'bg-blue-400',
  },
  approved: {
    labelKey: 'Dashboard.statusApproved',
    className:
      'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    dotColor: 'bg-green-500',
  },
  rejected: {
    labelKey: 'Dashboard.statusRejected',
    className:
      'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    dotColor: 'bg-red-500',
  },
};

// ─── Relative time helper ────────────────────────────────────────────────────
// Receives nowMs from the parent to avoid calling Date.now() during render.

function formatTime(date: Date, locale: string): string {
  return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

function formatRelativeTime(date: Date, nowMs: number, locale: string): string {
  const isTh = locale === 'th-TH';
  const diffMs = nowMs - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const timeStr = formatTime(date, locale);

  if (diffSec < 60) {
    return isTh ? `${diffSec} วินาทีที่แล้ว` : `${diffSec}s ago`;
  }
  if (diffMin < 60) {
    return isTh ? `${diffMin} นาทีที่แล้ว` : `${diffMin}m ago`;
  }
  if (diffHour < 24) {
    return isTh ? `${diffHour} ชม. ที่แล้ว` : `${diffHour} hr. ago`;
  }
  if (diffDay === 1) {
    return isTh ? `เมื่อวาน, ${timeStr} น.` : `Yesterday, ${timeStr}`;
  }
  if (diffDay < 7) {
    return isTh ? `${diffDay} วันที่แล้ว, ${timeStr} น.` : `${diffDay} days ago, ${timeStr}`;
  }
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const { t } = useTranslation();
  const cfg = badgeConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 sm:gap-1.5 shrink-0 rounded-full px-2 py-0.5 sm:px-2.5 text-xs sm:text-elder-xs font-medium whitespace-nowrap',
        cfg.className,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dotColor)} />
      {t(cfg.labelKey)}
    </span>
  );
}

interface SubmissionRowProps {
  submission: Submission;
  nowMs: number;
  locale: string;
}

function SubmissionRow({ submission, nowMs, locale }: SubmissionRowProps) {
  const { t } = useTranslation();
  const relativeTime = formatRelativeTime(submission.submittedAt, nowMs, locale);

  return (
    <li className="flex items-start justify-between gap-2 sm:gap-3 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-700/60 last:border-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <p className="text-elder-xs sm:text-elder-sm font-medium text-gray-800 dark:text-gray-100 truncate">
          {submission.title}
        </p>
        <p className="text-xs sm:text-elder-xs text-gray-400 dark:text-gray-500 mt-0.5 sm:mt-1">
          {t('Dashboard.submissionTeachingHours', { hours: submission.teachingHours })}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 sm:gap-1.5 shrink-0">
        <StatusBadge status={submission.status} />
        <p className="flex items-center gap-1 text-xs sm:text-elder-xs text-gray-400 dark:text-gray-500">
          <Clock className="w-3 h-3 shrink-0" />
          {relativeTime}
        </p>
      </div>
    </li>
  );
}

function SkeletonRow() {
  return (
    <li className="flex items-center justify-between gap-3 py-3 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-28 rounded-full" />
    </li>
  );
}

function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
        <BadgeCheck className="w-6 h-6 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-elder-sm font-medium text-gray-500 dark:text-gray-400">
        {t('Dashboard.noSubmissions')}
      </p>
      <p className="text-elder-xs text-gray-400 dark:text-gray-500">
        {t('Dashboard.noSubmissionsHint')}
      </p>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

interface RecentSubmissionsCardProps {
  submissions: Submission[];
  loading?: boolean;
  /**
   * A snapshot of Date.now() captured when the data was fetched (stored in DashboardData.fetchedAt).
   * Passed in from the parent so we never call Date.now() inside a render function.
   */
  nowMs: number;
}

export function RecentSubmissionsCard({
  submissions,
  loading,
  nowMs,
}: RecentSubmissionsCardProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'th' ? 'th-TH' : 'en-US';
  const displayed = submissions.slice(0, 5);

  return (
    <Card className="bg-white dark:bg-[#2a2a2a] rounded-2xl border-gray-100 dark:border-gray-700 shadow-sm col-span-full py-0">
      <CardContent className="p-4 sm:p-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-[#F27F0D]" />
            <h2 className="text-elder-base sm:text-elder-lg font-bold text-gray-700 dark:text-gray-200">
              {t('Dashboard.recentSubmissions')}
            </h2>
          </div>

          <Link
            href="/workload/history"
            className="text-elder-xs sm:text-elder-md font-semibold text-[#F27F0D] hover:text-[#d96e0a] hover:underline transition-colors"
          >
            {t('Dashboard.viewAll')}
          </Link>
        </div>

        <div className="-mx-4 sm:-mx-6 border-b-2 border-gray-100 dark:border-gray-700" />

        {/* Submission list */}
        <ul className="mt-0">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : displayed.length === 0 ? (
            <EmptyState />
          ) : (
            displayed.map((s) => (
              <SubmissionRow key={s.id} submission={s} nowMs={nowMs} locale={locale} />
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
