'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
} from 'lucide-react';
import type { ProcessType } from '@/lib/generated/prisma/client';
import type {
  WorkloadHistoryDetailServiceItem,
  WorkloadHistorySessionSlot,
  WorkloadHistoryWeekItem,
} from '@/lib/services/workload/history.service';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { WeeklyGridColumn } from '@/components/workload/workload-form/WeeklyGrid';
import { WeeklyGrid } from '@/components/workload/workload-form/WeeklyGrid';
import {
  formatHistoryCompactDateTime,
  WorkloadStatusBadge,
  WorkloadStatusTimeline,
} from '@/components/workload/history/WorkloadHistoryStatus';

type DayKey =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

const DAY_ORDER: DayKey[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

function normalizeDayOfWeek(dayOfWeek: string): DayKey | null {
  const normalized = dayOfWeek.trim().toLowerCase();

  if (['sun', 'sunday', 'อาทิตย์', 'วันอาทิตย์'].includes(normalized)) {
    return 'sunday';
  }

  if (['mon', 'monday', 'จันทร์', 'วันจันทร์'].includes(normalized)) {
    return 'monday';
  }

  if (['tue', 'tues', 'tuesday', 'อังคาร', 'วันอังคาร'].includes(normalized)) {
    return 'tuesday';
  }

  if (['wed', 'wednesday', 'พุธ', 'วันพุธ'].includes(normalized)) {
    return 'wednesday';
  }

  if (['thu', 'thur', 'thurs', 'thursday', 'พฤหัสบดี', 'วันพฤหัสบดี'].includes(normalized)) {
    return 'thursday';
  }

  if (['fri', 'friday', 'ศุกร์', 'วันศุกร์'].includes(normalized)) {
    return 'friday';
  }

  if (['sat', 'saturday', 'เสาร์', 'วันเสาร์'].includes(normalized)) {
    return 'saturday';
  }

  return null;
}

function formatNumber(value: number, isEnglish: boolean) {
  return new Intl.NumberFormat(isEnglish ? 'en-US' : 'th-TH', {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatHours(value: number | null, isEnglish: boolean, unitLabel: string, emptyLabel: string) {
  if (value == null) {
    return emptyLabel;
  }

  return `${formatNumber(value, isEnglish)} ${unitLabel}`;
}

function formatSessionRanges(sessions: WorkloadHistorySessionSlot[], emptyLabel: string) {
  if (sessions.length === 0) {
    return emptyLabel;
  }

  return sessions.map((session) => `${session.startTime} - ${session.endTime}`).join(', ');
}

function getProcessMeta(type: ProcessType, t: (key: string) => string) {
  switch (type) {
    case 'approved':
      return {
        label: t('WorkloadHistoryDetail.processApproved'),
        badgeClass: 'border-[#BBF7D0] bg-[#DCFCE7] text-[#15803D]',
      };
    case 'rejected':
      return {
        label: t('WorkloadHistoryDetail.processRejected'),
        badgeClass: 'border-[#FECACA] bg-[#FEE2E2] text-[#DC2626]',
      };
    case 'draft':
      return {
        label: t('WorkloadHistoryDetail.processDraft'),
        badgeClass: 'border-border bg-muted text-muted-foreground',
      };
    default:
      return {
        label: t('WorkloadHistoryDetail.processSubmitted'),
        badgeClass: 'border-[#FED7AA] bg-[#FFEDD5] text-[#C2410C]',
      };
  }
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="space-y-1 rounded-lg border border-border/60 bg-background/60 p-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#64748B]">
        {label}
      </p>
      <p className="text-sm font-medium text-[#1E293B] dark:text-[#F5EEE8]">
        {value}
      </p>
    </div>
  );
}

function SidebarField({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] uppercase tracking-[0.05em] text-[#64748B]">
        {label}
      </p>
      <p className="text-sm font-medium text-[#1E293B] dark:text-[#F5EEE8]">
        {value}
      </p>
    </div>
  );
}

function WeekSelectionCard({
  title,
  weeks,
  totalWeeks,
}: {
  title: string;
  weeks: WorkloadHistoryWeekItem[];
  totalWeeks: number;
}) {
  const { t } = useTranslation();
  const maxWeek = Math.max(
    totalWeeks,
    weeks.reduce((currentMax, week) => Math.max(currentMax, week.weekNumber), 0),
  );
  const weeksByNumber = new Map(weeks.map((week) => [week.weekNumber, week]));

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-[#F27F0D]" />
        <h3 className="text-base font-medium text-foreground">{title}</h3>
      </div>
      <div className="mt-3 h-0.5 rounded-full bg-[#F27F0D]" />

      {maxWeek === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          {t('WorkloadHistoryDetail.noWeekData')}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
          {Array.from({ length: maxWeek }, (_, index) => {
            const weekNumber = index + 1;
            const week = weeksByNumber.get(weekNumber);
            const isActive = Boolean(week);
            const isExternal = week?.external;

            return (
              <div
                key={weekNumber}
                className={cn(
                  'flex min-h-[54px] flex-col items-center justify-center rounded-md border px-2 py-2 text-center',
                  isActive && !isExternal && 'border-[#22C55E] bg-[#22C55E] text-white',
                  isActive && isExternal && 'border-[#F27F0D]/30 bg-[#FFF7ED] text-[#9A3412]',
                  !isActive && 'border-border bg-[#F8F7F5] text-[#1E293B] dark:bg-[#2B2421] dark:text-[#DCCFC7]',
                )}
              >
                <span className="text-[11px] font-bold leading-4">W{weekNumber}</span>
                {isExternal && (
                  <span className="mt-1 max-w-full truncate text-[10px] leading-4">
                    {week?.instructorName || t('WorkloadHistoryDetail.externalSpeaker')}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function WorkloadHistoryDetailContent({
  detail,
}: {
  detail: WorkloadHistoryDetailServiceItem;
}) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');
  const activeDay = normalizeDayOfWeek(detail.dayOfWeek);
  const scheduleSessions = [
    ...detail.theorySessions.map((session) => ({ type: 'theory' as const, session })),
    ...detail.labSessions.map((session) => ({ type: 'lab' as const, session })),
  ];
  const hoursUnit = t('WorkloadHistoryDetail.hoursUnit');
  const emptyLabel = t('WorkloadHistoryDetail.notAvailable');
  const theoryTimeText = formatSessionRanges(detail.theorySessions, emptyLabel);
  const labTimeText = formatSessionRanges(detail.labSessions, emptyLabel);
  const sectionLabel = isEnglish ? `Section ${detail.section}` : `หมู่เรียน ${detail.section}`;
  const weeklyGridColumns: WeeklyGridColumn[] = DAY_ORDER.map((day) => ({
    dayCode: day,
    dayName: day,
    courses:
      activeDay === day
        ? scheduleSessions.map(({ type, session }, index) => ({
          id: `${detail.id}-${day}-${type}-${index}`,
          courseCode: detail.courseCode,
          courseName: detail.courseName,
          time: `${session.startTime} - ${session.endTime}`,
          room: `${type === 'theory' ? t('WorkloadHistoryDetail.sessionTheory') : t('WorkloadHistoryDetail.sessionLab')} • ${sectionLabel}`,
          studentCount: detail.studentsRegistered,
        }))
        : [],
  }));

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-4 pb-8 pt-1 md:gap-5">
      <div className="flex justify-start">
        <Button asChild variant="outline" className="gap-2 border-[#F27F0D]/20 text-[#F27F0D] hover:bg-orange-50 hover:text-[#F27F0D]">
          <Link href="/workload/history">
            <ArrowLeft className="h-4 w-4" />
            <span>{t('WorkloadHistoryDetail.backToHistory')}</span>
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-xl font-semibold leading-tight text-foreground md:text-[24px] md:leading-[30px]">
            {t('WorkloadHistoryDetail.title')}
          </h1>
          <p className="text-sm font-medium text-muted-foreground md:text-lg md:leading-7">
            {t('WorkloadHistoryDetail.subtitle', {
              year: detail.year,
              semester: detail.semester,
            })}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#F1E4D7] bg-card shadow-sm">
          <WorkloadStatusTimeline
            status={detail.status}
            submittedAt={detail.submittedAt}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <WeeklyGrid
          columns={weeklyGridColumns}
          semesterBadge={t('WorkloadHistoryDetail.scheduleTerm', {
            semester: detail.semester,
            year: detail.year,
          })}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#F27F0D]" />
              <h2 className="text-base font-medium text-foreground">
                {t('WorkloadHistoryDetail.courseInfo')}
              </h2>
            </div>
            <div className="mt-3 h-0.5 rounded-full bg-[#F27F0D]" />

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <DetailField label={t('WorkloadHistoryDetail.faculty')} value={detail.faculty} />
              <DetailField label={t('WorkloadHistoryDetail.major')} value={detail.major} />
              <DetailField label={t('WorkloadHistoryDetail.yearLevel')} value={detail.yearLevel} />
              <DetailField label={t('WorkloadHistoryDetail.section')} value={detail.section} />
              <DetailField
                label={t('WorkloadHistoryDetail.studentsRegistered')}
                value={detail.studentsRegistered}
              />
              <DetailField
                label={t('WorkloadHistoryDetail.studentsPerWeek')}
                value={detail.studentsPerWeek}
              />
            </div>
          </div>

          <WeekSelectionCard
            title={t('WorkloadHistoryDetail.theoryWeeks')}
            weeks={detail.theoryWeeks}
            totalWeeks={detail.expectedTheoryWeeks}
          />

          <WeekSelectionCard
            title={t('WorkloadHistoryDetail.labWeeks')}
            weeks={detail.labWeeks}
            totalWeeks={detail.expectedLabWeeks}
          />
        </div>

        <div className="rounded-xl border border-[#F27F0D]/20 bg-[#F27F0D]/5 p-4 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#F27F0D]/15 pb-4 sm:flex-row sm:items-start sm:justify-between">
            <h2 className="text-base font-medium text-[#F27F0D]">
              {t('WorkloadHistoryDetail.selectedCourse')}
            </h2>
            <WorkloadStatusBadge status={detail.status} />
          </div>

          <div className="mt-4 space-y-4">
            <SidebarField label={t('WorkloadHistoryDetail.courseName')} value={detail.courseName} />
            <SidebarField label={t('WorkloadHistoryDetail.courseCode')} value={detail.courseCode} />

            <div className="grid gap-4 grid-cols-2 grid-row-1">
              <SidebarField label={t('WorkloadHistoryDetail.credits')} value={detail.credits} />
              <SidebarField label={t('WorkloadHistoryDetail.degree')} value={detail.degree} />
              <SidebarField label={t('WorkloadHistoryDetail.theoryTime')} value={theoryTimeText} />
              <SidebarField label={t('WorkloadHistoryDetail.labTime')} value={labTimeText} />
              <SidebarField
                label={t('WorkloadHistoryDetail.theoryHours')}
                value={formatHours(detail.totalTheoryHours, isEnglish, hoursUnit, emptyLabel)}
              />
              <SidebarField
                label={t('WorkloadHistoryDetail.labHours')}
                value={formatHours(detail.totalLabHours, isEnglish, hoursUnit, emptyLabel)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-4 py-4 md:px-5">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-[#F27F0D]" />
            <h2 className="text-lg font-bold text-[#1E293B] dark:text-[#F5EEE8]">
              {t('WorkloadHistoryDetail.processHistory')}
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>{t('WorkloadHistoryDetail.historyAction')}</TableHead>
                <TableHead>{t('WorkloadHistoryDetail.historyDate')}</TableHead>
                <TableHead>{t('WorkloadHistoryDetail.historyStatus')}</TableHead>
                <TableHead>{t('WorkloadHistoryDetail.historyActor')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.processes.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="py-10 text-center text-base text-muted-foreground">
                    {t('WorkloadHistory.noRecords')}
                  </TableCell>
                </TableRow>
              ) : (
                detail.processes.map((process) => {
                  const meta = getProcessMeta(process.type, t);

                  return (
                    <TableRow key={process.id} className="hover:bg-transparent">
                      <TableCell className="font-medium text-foreground">
                        {meta.label}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatHistoryCompactDateTime(process.createdAt, isEnglish)}
                      </TableCell>
                      <TableCell>
                        <span className={cn('inline-flex rounded-full border px-3 py-1 text-xs font-bold', meta.badgeClass)}>
                          {meta.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {process.actorName || t('WorkloadHistoryDetail.actorFallback')}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
