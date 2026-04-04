'use client';

import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpDown,
  Check,
  CircleDashed,
  ChevronDown,
  Eye,
  FileText,
  X,
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

type WorkloadRecord = WorkloadHistoryServiceItem;

interface WorkloadHistoryTableProps {
  records: WorkloadRecord[];
  totalFiltered: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPaginationItems(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
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
  formatTimelineDate,
}: {
  record: WorkloadRecord;
  formatTimelineDate: (s: string) => string;
}) {
  const { t } = useTranslation();
  const s = record.status;

  type Step = {
    label: string;
    detail: string;
    done: boolean;
    active: boolean;
    rejected: boolean;
  };
  const steps: Step[] = [
    {
      label: t('WorkloadHistory.timelineSubmitted'),
      detail: formatTimelineDate(record.submittedAt),
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
    <div className="bg-[#FFFBF6] px-5 py-6 dark:bg-[#211B19] md:px-8 lg:px-[50px] lg:py-[30px]">
      <div className="grid gap-0 md:grid-cols-4 md:gap-0 md:items-start">
        {steps.map((step, i) => {
          const circleClass = step.rejected
            ? 'bg-[#DC2626] text-white shadow-[0_8px_18px_rgba(220,38,38,0.18)]'
            : 'bg-[#F27F0D] text-white shadow-[0_8px_18px_rgba(242,127,13,0.2)]';
          const titleClass = step.rejected
            ? 'text-[#B42318]'
            : 'text-[#111111] dark:text-[#F5EEE8]';
          const detailClass = step.rejected
            ? 'text-[#B42318]'
            : 'text-[#8A8178] dark:text-[#B7ABA4]';
          const lineClass = step.rejected ? 'border-[#DC2626] border-solid' : step.done ? 'border-[#F27F0D] border-solid' : 'border-[#F27F0D] border-dashed';

          return (
            <div key={step.label} className="flex min-w-0 items-start gap-0 text-left md:flex-col md:items-center md:gap-0 md:text-center">
              <div className="flex min-w-0 flex-col items-center">
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors', circleClass)}>
                  {step.rejected ? (
                    <X className="h-4 w-4" strokeWidth={2.5} />
                  ) : step.done ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    <CircleDashed className="h-[18px] w-[18px]" strokeWidth={2.25} />
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div className="my-0 flex h-10 justify-center md:hidden">
                    <div className={cn('h-full border-l', lineClass)} />
                  </div>
                )}
              </div>
              <div className={cn('hidden w-full md:block', i === steps.length - 1 && 'md:w-full')}>
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

  const formatTimelineDate = (iso: string) => {
    const d = new Date(iso);
    if (isEn) {
      const date = new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Bangkok',
      }).format(d);
      const time = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Bangkok',
      }).format(d);
      return `${date} | ${time}`;
    }

    const date = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Bangkok',
    }).format(d);
    const time = new Intl.DateTimeFormat('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Bangkok',
    }).format(d);
    return `${date} | ${time}`;
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

      <div className="lg:hidden">
        {records.length === 0 ? (
          <div className="px-4 py-10 text-center text-base text-muted-foreground">
            {t('WorkloadHistory.noRecords')}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {records.map((record) => {
              const isOpen = expandedId === record.id;
              return (
                <div key={record.id} className="bg-card">
                  <div className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-foreground">
                          {t('WorkloadHistory.colYear')} {record.year}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t('WorkloadHistory.colSemester')} {record.semester}
                        </p>
                      </div>
                      <StatusBadge status={record.status} />
                    </div>

                    <div className="rounded-xl bg-muted/40 p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {t('WorkloadHistory.colSubmittedAt')}
                      </p>
                      <p className="mt-1 text-sm text-foreground">
                        {formatDate(record.submittedAt)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button type="button" className="flex items-center gap-[5px] rounded-[10px] border border-[#F27F0D]/20 px-3 py-2 transition-opacity hover:opacity-70">
                        <Eye className="h-[15px] w-[15px] text-[#F27F0D]" />
                        <span className="text-sm font-medium leading-3 text-[#F27F0D]">
                          {t('WorkloadHistory.btnDetails')}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleExpand(record.id)}
                        className="flex items-center gap-[3px] rounded-[10px] px-3 py-2 transition-opacity hover:opacity-70"
                      >
                        <span className="text-xs font-normal leading-3 text-muted-foreground">
                          {t('WorkloadHistory.btnStatus')}
                        </span>
                        <ChevronDown className={cn('h-[15px] w-[15px] text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
                      </button>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <div className="overflow-hidden">
                      <StatusTimeline record={record} formatTimelineDate={formatTimelineDate} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="hidden lg:block">
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
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={5} className="p-0">
                        <div
                          className={cn(
                            'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
                            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                          )}
                        >
                          <div className="overflow-hidden">
                            <StatusTimeline record={record} formatTimelineDate={formatTimelineDate} />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="border-t border-border bg-card px-4 py-4 md:px-5">
        <Pagination className="justify-between gap-3 max-md:flex-col">
          <div className="text-sm text-muted-foreground">
            {t('WorkloadHistory.page')} {currentPage} {t('WorkloadHistory.pageOf')} {totalPages}
          </div>
          <PaginationContent className="flex-wrap justify-center">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="min-w-[96px]"
              >
                {t('WorkloadHistory.prevPage')}
              </PaginationPrevious>
            </PaginationItem>
            {getPaginationItems(currentPage, totalPages).map((item, index) => (
              <PaginationItem key={`${item}-${index}`}>
                {item === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={item === currentPage}
                    onClick={() => onPageChange(item)}
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="min-w-[96px]"
              >
                {t('WorkloadHistory.nextPage')}
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
