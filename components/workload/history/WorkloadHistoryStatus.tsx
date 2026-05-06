'use client';

import { Check, CircleDashed, Pencil, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { WorkloadStatus } from '@/lib/services/workload/history.service';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<
  WorkloadStatus,
  { bg: string; dot: string; text: string; labelKey: string }
> = {
  pendingDepartment: {
    bg: 'bg-[#FFFBEB]',
    dot: 'bg-[#F27F0D]',
    text: 'text-[#F27F0D]',
    labelKey: 'WorkloadHistory.statusPendingDepartment',
  },
  pendingDean: {
    bg: 'bg-[#FFFBEB]',
    dot: 'bg-[#F27F0D]',
    text: 'text-[#F27F0D]',
    labelKey: 'WorkloadHistory.statusPendingDean',
  },
  needsRevision: {
    bg: 'bg-[#FEECEE]',
    dot: 'bg-[#F25555]',
    text: 'text-[#F25555]',
    labelKey: 'WorkloadHistory.statusNeedsRevision',
  },
  resubmitted: {
    bg: 'bg-[#F4ECFF]',
    dot: 'bg-[#6D34F5]',
    text: 'text-[#6D34F5]',
    labelKey: 'WorkloadHistory.statusResubmitted',
  },
  approved: {
    bg: 'bg-[#DCFCE7]',
    dot: 'bg-[#15803D]',
    text: 'text-[#15803D]',
    labelKey: 'WorkloadHistory.statusApproved',
  },
  rejected: {
    bg: 'bg-[#FEE2E2]',
    dot: 'bg-[#DC2626]',
    text: 'text-[#DC2626]',
    labelKey: 'WorkloadHistory.statusRejected',
  },
};

export function formatHistorySubmittedDate(iso: string, isEnglish: boolean) {
  const date = new Date(iso);

  if (isEnglish) {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Bangkok',
    }).format(date);
    const formattedTime = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Bangkok',
    }).format(date);

    return `Submitted ${formattedDate} at ${formattedTime}`;
  }

  const formattedDate = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  }).format(date);
  const formattedTime = new Intl.DateTimeFormat('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Bangkok',
  }).format(date);

  return `วันที่ส่ง ${formattedDate} เวลา ${formattedTime} น.`;
}

export function formatHistoryCompactDateTime(iso: string, isEnglish: boolean) {
  const date = new Date(iso);

  if (isEnglish) {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Bangkok',
    }).format(date);
    const formattedTime = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Bangkok',
    }).format(date);

    return `${formattedDate} | ${formattedTime}`;
  }

  const formattedDate = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  }).format(date);
  const formattedTime = new Intl.DateTimeFormat('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Bangkok',
  }).format(date);

  return `${formattedDate} | ${formattedTime}`;
}

export function WorkloadStatusBadge({ status }: { status: WorkloadStatus }) {
  const { t } = useTranslation();
  const config = STATUS_CONFIG[status];

  return (
    <span className={cn('inline-flex min-h-9 items-center gap-1.5 rounded-full px-4 py-1.5', config.bg)}>
      <span className={cn('h-2 w-2 shrink-0 rounded-full', config.dot)} />
      <span className={cn('text-xs font-bold leading-4', config.text)}>
        {t(config.labelKey)}
      </span>
    </span>
  );
}

export function WorkloadStatusTimeline({
  status,
  submittedAt,
}: {
  status: WorkloadStatus;
  submittedAt: string;
}) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');

  const steps = [
    {
      label: t('WorkloadHistory.timelineSubmitted'),
      detail: formatHistoryCompactDateTime(submittedAt, isEnglish),
      done: true,
      active: false,
      revision: false,
      rejected: false,
    },
    {
      label: t('WorkloadHistory.timelineDepartmentHead'),
      detail:
        status === 'pendingDepartment'
          ? t('WorkloadHistory.timelinePendingApproval')
          : status === 'needsRevision' || status === 'resubmitted'
            ? t('WorkloadHistory.statusNeedsRevision')
            : t('WorkloadHistory.timelineReviewed'),
      done: status !== 'pendingDepartment',
      active: status === 'pendingDepartment',
      revision: status === 'needsRevision',
      rejected: false,
    },
    {
      label: t('WorkloadHistory.timelineDean'),
      detail:
        status === 'pendingDean'
          ? t('WorkloadHistory.timelinePendingApproval')
          : status === 'approved'
            ? t('WorkloadHistory.timelineApproved')
            : status === 'rejected'
              ? t('WorkloadHistory.statusRejected')
            : t('WorkloadHistory.timelineInProgress'),
      done: status === 'approved' || status === 'rejected',
      active: status === 'pendingDean',
      revision: false,
      rejected: status === 'rejected',
    },
    {
      label: t('WorkloadHistory.timelineCompleted'),
      detail:
        status === 'approved'
          ? t('WorkloadHistory.timelineCompletedDetail')
          : t('WorkloadHistory.timelineInProgress'),
      done: status === 'approved',
      active: false,
      revision: false,
      rejected: false,
    },
  ];

  return (
    <div className="bg-[#FFFBF6] px-5 py-6 dark:bg-[#211B19] md:px-8 lg:px-[50px] lg:py-[30px]">
      <div className="grid gap-0 md:grid-cols-4 md:items-start md:gap-0">
        {steps.map((step, index) => {
          const isAlert = step.rejected || step.revision;
          const circleClass = isAlert
            ? 'bg-[#DC2626] text-white shadow-[0_8px_18px_rgba(220,38,38,0.18)]'
            : 'bg-[#F27F0D] text-white shadow-[0_8px_18px_rgba(242,127,13,0.2)]';
          const titleClass = isAlert
            ? 'text-[#B42318]'
            : 'text-[#111111] dark:text-[#F5EEE8]';
          const detailClass = isAlert
            ? 'text-[#B42318]'
            : 'text-[#8A8178] dark:text-[#B7ABA4]';
          const lineClass = isAlert
            ? 'border-[#DC2626] border-solid'
            : step.done
              ? 'border-[#F27F0D] border-solid'
              : 'border-[#F27F0D] border-dashed';

          return (
            <div
              key={step.label}
              className="flex min-w-0 items-start gap-0 text-left md:flex-col md:items-center md:gap-0 md:text-center"
            >
              <div className="flex min-w-0 flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors',
                    circleClass,
                  )}
                >
                  {step.revision ? (
                    <Pencil className="h-4 w-4" strokeWidth={2.5} />
                  ) : step.rejected ? (
                    <X className="h-4 w-4" strokeWidth={2.5} />
                  ) : step.done ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    <CircleDashed className="h-[18px] w-[18px]" strokeWidth={2.25} />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="my-0 flex h-10 justify-center md:hidden">
                    <div className={cn('h-full border-l', lineClass)} />
                  </div>
                )}
              </div>
              <div className={cn('hidden w-full md:block', index === steps.length - 1 && 'md:w-full')}>
                <div className={cn('w-full border-t md:mt-2', lineClass)} />
              </div>
              <div className="min-w-0 flex-1 pl-3 md:flex-none md:pt-2 md:pl-0">
                <p className={cn('text-[14px] font-medium leading-5', titleClass)}>{step.label}</p>
                <p className={cn('text-[10px] leading-4', detailClass)}>{step.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
