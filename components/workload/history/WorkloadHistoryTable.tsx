'use client';

import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
} from 'lucide-react';
import type {
  WorkloadHistoryServiceItem,
  WorkloadStatus,
} from '@/lib/services/workload/history.service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type WorkloadRecord = WorkloadHistoryServiceItem;

interface WorkloadHistoryTableProps {
  records: WorkloadRecord[];
  totalFiltered: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// ─── Status config ────────────────────────────────────────────────────────────
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

// ─── Status badge ─────────────────────────────────────────────────────────────
// Figma: padding 4px 12px | gap 6px | radius 9999px | Noto Sans Thai 700 12px
function StatusBadge({ status }: { status: WorkloadStatus }) {
  const { t } = useTranslation();
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={cn('inline-flex min-h-9 items-center gap-1.5 rounded-full px-4 py-1.5', cfg.bg)}>
      <span className={cn('h-2 w-2 shrink-0 rounded-full', cfg.dot)} />
      <span className={cn('text-xs font-bold leading-4', cfg.text)}>
        {t(cfg.labelKey)}
      </span>
    </span>
  );
}

// ─── Status timeline (expandable) ─────────────────────────────────────────────
// Figma Row: bg #FFFBF6 | padding 30px 50px (desktop) | responsive on mobile
function StatusTimeline({
  record,
  formatDate,
}: {
  record: WorkloadRecord;
  formatDate: (s: string) => string;
}) {
  const { t } = useTranslation();
  const s = record.status;

  type Step = { label: string; detail: string; done: boolean; active: boolean; rejected: boolean };
  const steps: Step[] = [
    {
      label: t('WorkloadHistory.timelineSubmitted'),
      detail: formatDate(record.submittedAt),
      done: true, active: false, rejected: false,
    },
    {
      label: t('WorkloadHistory.timelineDepartmentHead'),
      detail:
        s === 'pendingDepartment' ? t('WorkloadHistory.timelinePendingApproval')
        : s === 'needsRevision' || s === 'resubmitted' ? t('WorkloadHistory.statusNeedsRevision')
        : t('WorkloadHistory.timelineReviewed'),
      done: s !== 'pendingDepartment',
      active: s === 'pendingDepartment',
      rejected: s === 'needsRevision',
    },
    {
      label: t('WorkloadHistory.timelineDean'),
      detail:
        s === 'pendingDean' ? t('WorkloadHistory.timelinePendingApproval')
        : s === 'approved' ? t('WorkloadHistory.timelineApproved')
        : s === 'rejected' ? t('WorkloadHistory.statusRejected')
        : t('WorkloadHistory.timelineInProgress'),
      done: s === 'approved' || s === 'rejected',
      active: s === 'pendingDean',
      rejected: s === 'rejected',
    },
    {
      label: t('WorkloadHistory.timelineCompleted'),
      detail: s === 'approved' ? t('WorkloadHistory.timelineCompletedDetail') : t('WorkloadHistory.timelineInProgress'),
      done: s === 'approved', active: false, rejected: false,
    },
  ];

  return (
    <div className="bg-[#FFFBF6] px-4 py-6 md:px-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex items-start justify-around">
        {steps.map((step, i) => {
          const circleClass = step.rejected
            ? 'bg-[#DC2626] text-white'
            : step.done || step.active
              ? 'bg-[#F27F0D] text-white'
              : 'bg-muted text-muted-foreground';
          const titleClass = step.rejected ? 'text-[#DC2626]'
            : step.active ? 'text-[#F27F0D]'
            : step.done ? 'text-foreground'
            : 'text-[#8E8E8E]';
          const detailClass = step.rejected ? 'text-[#DC2626]'
            : step.active ? 'text-[#C96A0A]'
            : 'text-[#8E8E8E]';

          return (
            <Fragment key={step.label}>
              <div className="flex flex-col items-center gap-2 text-center" style={{ minWidth: '60px', maxWidth: '140px' }}>
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold', circleClass)}>
                  {step.rejected ? '✕' : step.done || step.active ? '✓' : String(i + 1)}
                </div>
                <p className={cn('text-xs font-medium leading-4 md:text-sm', titleClass)}>{step.label}</p>
                <p className={cn('text-[10px] leading-4 md:text-[11px]', detailClass)}>{step.detail}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="mt-4 flex-1 px-1">
                  <div className={cn('h-px w-full', step.done && !step.rejected ? 'bg-[#F27F0D]' : 'border-t border-dashed border-[#F27F0D]/50')} />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Table ───────────────────────────────────────────────────────────────
export function WorkloadHistoryTable({
  records,
  totalFiltered,
  currentPage,
  totalPages,
  onPageChange,
}: WorkloadHistoryTableProps) {
  const { t, i18n } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const isEn = i18n.language.startsWith('en');

  // Date formatter — TH: Buddhist Era / EN: Gregorian
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (isEn) {
      const date = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Bangkok' }).format(d);
      const time = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' }).format(d);
      return `Submitted ${date} at ${time}`;
    }
    const date = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Bangkok' }).format(d);
    const time = new Intl.DateTimeFormat('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' }).format(d);
    return `วันที่ส่ง ${date} เวลา ${time} น.`;
  };

  const toggleExpand = (id: string) => setExpandedId((cur) => (cur === id ? null : id));

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[15px] border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-card px-5 py-[15px]">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-[#F27F0D]" />
          <h2 className="text-lg font-bold leading-7 text-foreground">
            {t('WorkloadHistory.allRecords')}
          </h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {totalFiltered} {t('WorkloadHistory.countUnit')}
        </span>
      </div>

      <Table className="min-w-[860px]">
        <TableHeader>
          <TableRow className="bg-muted/60 hover:bg-muted/60">
            <TableHead className="w-[117px] px-4 text-center text-base font-medium text-muted-foreground">
              {t('WorkloadHistory.colYear')}
            </TableHead>
            <TableHead className="w-[74px] px-4 text-center text-base font-medium text-muted-foreground">
              {t('WorkloadHistory.colSemester')}
            </TableHead>
            <TableHead className="px-4 text-center text-base font-medium text-muted-foreground">
              {t('WorkloadHistory.colSubmittedAt')}
            </TableHead>
            <TableHead className="w-[168px] px-4 text-center text-base font-medium text-muted-foreground">
              <span className="inline-flex items-center justify-center gap-1">
                {t('WorkloadHistory.colStatus')}
                <ArrowUpDown className="h-4 w-4" />
              </span>
            </TableHead>
            <TableHead className="w-[137px] px-4 text-center text-base font-medium text-muted-foreground">
              {t('WorkloadHistory.colAction')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="py-10 text-center text-base text-muted-foreground">
                {t('WorkloadHistory.noRecords')}
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => {
              const isOpen = expandedId === record.id;
              return (
                <Fragment key={record.id}>
                  <TableRow className="hover:bg-transparent">
                    <TableCell className="h-[81px] px-4 text-center text-base font-medium text-foreground">
                      {record.year}
                    </TableCell>
                    <TableCell className="h-[81px] px-4 text-center text-base font-medium text-foreground">
                      {record.semester}
                    </TableCell>
                    <TableCell className="h-[81px] px-4 text-center text-base font-medium text-muted-foreground">
                      {formatDate(record.submittedAt)}
                    </TableCell>
                    <TableCell className="h-[81px] px-4">
                      <div className="flex justify-center">
                        <StatusBadge status={record.status} />
                      </div>
                    </TableCell>
                    <TableCell className="h-[81px] px-4">
                      <div className="flex flex-col items-end justify-center gap-[5px]">
                        <button type="button" className="flex items-center gap-[5px] rounded-[5px] px-[10px] transition-opacity hover:opacity-70">
                          <Eye className="h-[15px] w-[15px] text-[#F27F0D]" />
                          <span className="text-sm font-medium leading-3 text-[#F27F0D]">
                            {t('WorkloadHistory.btnDetails')}
                          </span>
                        </button>
                        <button type="button" onClick={() => toggleExpand(record.id)} className="flex items-center gap-[3px] px-[5px] transition-opacity hover:opacity-70">
                          <span className="text-[10px] font-normal leading-3 text-muted-foreground">
                            {t('WorkloadHistory.btnStatus')}
                          </span>
                          <ChevronDown className={cn('h-[15px] w-[15px] text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {isOpen && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={5} className="p-0">
                        <StatusTimeline record={record} formatDate={formatDate} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="border-t border-border bg-card px-4 py-4 md:px-5">
        <div className="flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex h-8 items-center gap-1 rounded-[10px] border border-[#F27F0D] px-3 text-xs font-medium text-[#F27F0D] disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden md:inline">{t('WorkloadHistory.prevPage')}</span>
          </button>
          <span className="text-sm text-[#F27F0D]">
            {t('WorkloadHistory.page')} {currentPage} {t('WorkloadHistory.pageOf')} {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex h-8 items-center gap-1 rounded-[10px] border border-[#F27F0D] px-3 text-xs font-medium text-[#F27F0D] disabled:opacity-30"
          >
            <span className="hidden md:inline">{t('WorkloadHistory.nextPage')}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-auto hidden h-8 w-full max-w-[1013px] items-center justify-between lg:flex">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex h-8 w-[144px] shrink-0 items-center justify-center gap-[5px] rounded-[10px] border border-[#F27F0D] px-6 text-xs font-medium text-[#F27F0D] transition-opacity hover:bg-orange-50 disabled:opacity-30"
          >
            <ChevronLeft className="h-[15px] w-[15px]" />
            <span className="flex h-4 w-[76px] items-center justify-center text-center">
              {t('WorkloadHistory.prevPage')}
            </span>
          </button>

          <div className="flex h-8 shrink-0 items-center gap-[13px]">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#F27F0D]">
              <FileText className="h-[15px] w-[15px] text-[#F27F0D]" />
            </div>
            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex h-8 w-[167px] shrink-0 items-center justify-center gap-[5px] rounded-[10px] border border-[#F27F0D] px-6 text-xs font-medium text-[#F27F0D] transition-opacity hover:bg-orange-50 disabled:opacity-30"
            >
              <span className="flex h-4 w-[99px] items-center justify-center text-center">
                {t('WorkloadHistory.nextPage')}
              </span>
              <ChevronRight className="h-[15px] w-[15px]" />
            </button>
          </div>

          <div className="flex h-8 shrink-0 items-center gap-[14px]">
            <span className="w-[39px] text-[16px] font-normal leading-6 text-[#F27F0D]">
              {t('WorkloadHistory.page')}
            </span>
            <div className="flex h-8 w-[130px] items-center justify-center rounded-[10px] border border-[#F27F0D] px-5 text-[16px] font-light text-[#F27F0D]">
              {currentPage}
            </div>
            <span className="text-[16px] font-normal leading-6 text-[#F27F0D]">
              {t('WorkloadHistory.pageOf')} {totalPages}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
