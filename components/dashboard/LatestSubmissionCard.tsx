'use client';

import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { SendHorizonal, Clock, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'draft' | 'processing';

interface LatestSubmissionCardProps {
  status: SubmissionStatus | null;
  loading?: boolean;
}

const statusConfig: Record<
  SubmissionStatus,
  { labelKey: string; dotColor: string; textColor: string; icon: React.ElementType }
> = {
  pending: {
    labelKey: 'Dashboard.statusPending',
    dotColor: 'bg-amber-400',
    textColor: 'text-gray-900 dark:text-white',
    icon: Clock,
  },
  approved: {
    labelKey: 'Dashboard.statusApproved',
    dotColor: 'bg-green-500',
    textColor: 'text-gray-900 dark:text-white',
    icon: CheckCircle2,
  },
  rejected: {
    labelKey: 'Dashboard.statusRejected',
    dotColor: 'bg-red-500',
    textColor: 'text-gray-900 dark:text-white',
    icon: XCircle,
  },
  draft: {
    labelKey: 'Dashboard.statusDraft',
    dotColor: 'bg-gray-400',
    textColor: 'text-gray-900 dark:text-white',
    icon: FileText,
  },
  processing: {
    labelKey: 'Dashboard.statusProcessing',
    dotColor: 'bg-blue-400',
    textColor: 'text-gray-900 dark:text-white',
    icon: SendHorizonal,
  },
};

export function LatestSubmissionCard({ status, loading }: LatestSubmissionCardProps) {
  const { t } = useTranslation();

  const cfg = status ? statusConfig[status] : null;

  return (
    <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm flex flex-col gap-3 sm:gap-4">
      {/* Icon box */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
        <SendHorizonal className="w-5 h-5 sm:w-6 sm:h-6 text-[#F27F0D]" />
      </div>

      {/* Label */}
      <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
        {t('Dashboard.latestSubmission')}
      </p>

      {/* Status */}
      {loading ? (
        <Skeleton className="h-8 w-40" />
      ) : cfg ? (
        <div className="flex items-center gap-2">
          <span className={cn('w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0', cfg.dotColor)} />
          <span className={cn('text-xl sm:text-2xl font-extrabold leading-none', cfg.textColor)}>
            {t(cfg.labelKey)}
          </span>
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500">—</p>
      )}
    </div>
  );
}
