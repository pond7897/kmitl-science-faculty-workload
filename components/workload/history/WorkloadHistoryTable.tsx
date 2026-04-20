'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpDown,
  ChevronDown,
  Eye,
  FileText,
} from 'lucide-react';
import type {
  WorkloadHistoryServiceItem,
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
import {
  formatHistorySubmittedDate,
  WorkloadStatusBadge,
  WorkloadStatusTimeline,
} from '@/components/workload/history/WorkloadHistoryStatus';

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
                      <WorkloadStatusBadge status={record.status} />
                    </div>

                    <div className="rounded-xl bg-muted/40 p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {t('WorkloadHistory.colSubmittedAt')}
                      </p>
                      <p className="mt-1 text-sm text-foreground">
                        {formatHistorySubmittedDate(record.submittedAt, isEn)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/workload/history/${record.id}`}
                        className="flex items-center gap-[5px] rounded-[10px] border border-[#F27F0D]/20 px-3 py-2 transition-opacity hover:opacity-70"
                      >
                        <Eye className="h-[15px] w-[15px] text-[#F27F0D]" />
                        <span className="text-sm font-medium leading-3 text-[#F27F0D]">
                          {t('WorkloadHistory.btnDetails')}
                        </span>
                      </Link>
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
                      <WorkloadStatusTimeline
                        status={record.status}
                        submittedAt={record.submittedAt}
                      />
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
                        {formatHistorySubmittedDate(record.submittedAt, isEn)}
                      </TableCell>
                      <TableCell className="h-[81px] px-4">
                        <div className="flex justify-center">
                          <WorkloadStatusBadge status={record.status} />
                        </div>
                      </TableCell>
                      <TableCell className="h-[81px] px-4">
                        <div className="flex flex-col items-end justify-center gap-[5px]">
                          <Link
                            href={`/workload/history/${record.id}`}
                            className="flex items-center gap-[5px] rounded-[5px] px-[10px] transition-opacity hover:opacity-70"
                          >
                            <Eye className="h-[15px] w-[15px] text-[#F27F0D]" />
                            <span className="text-sm font-medium leading-3 text-[#F27F0D]">
                              {t('WorkloadHistory.btnDetails')}
                            </span>
                          </Link>
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
                            <WorkloadStatusTimeline
                              status={record.status}
                              submittedAt={record.submittedAt}
                            />
ป                          </div>
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
